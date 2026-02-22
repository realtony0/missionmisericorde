import { prisma } from "./db";

const ALLOWED_PROJECT_CATEGORIES = new Set([
  "Puits",
  "Mini_forage",
  "Internats",
  "Mosquees",
  "Autres",
]);

export function normalizeProjectCategory(value: unknown): string {
  if (typeof value !== "string") return "Puits";
  const trimmed = value.trim();
  return ALLOWED_PROJECT_CATEGORIES.has(trimmed) ? trimmed : "Autres";
}

export function parsePhotoList(input: unknown): string[] {
  if (Array.isArray(input)) {
    return Array.from(
      new Set(
        input
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );
  }

  if (typeof input !== "string") return [];

  const raw = input.trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return Array.from(
        new Set(
          parsed
            .filter((item): item is string => typeof item === "string")
            .map((item) => item.trim())
            .filter(Boolean)
        )
      );
    }
  } catch {
    // Fall through and keep the original string if it's not JSON.
  }

  return [raw];
}

function toAchievementLocation(project: {
  location: string | null;
  region: string | null;
}) {
  if (project.location?.trim()) return project.location.trim();
  if (project.region?.trim()) return project.region.trim();
  return null;
}

async function getAvailableAchievementNumber(preferredNumber?: number | null) {
  if (typeof preferredNumber === "number") {
    const existing = await prisma.achievement.findUnique({
      where: { number: preferredNumber },
      select: { id: true },
    });
    if (!existing) return preferredNumber;
  }

  const highest = await prisma.achievement.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });

  return (highest?.number ?? 0) + 1;
}

export async function archiveProjectIfNeeded(projectId: string) {
  const project = await prisma.ongoingProject.findUnique({
    where: { id: projectId },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!project) return null;
  if (project.status !== "Terminé") return null;
  if (project.archivedAchievementId) return null;
  if (!project.archiveToAchievements) return null;

  const existing = await prisma.achievement.findUnique({
    where: { sourceProjectId: project.id },
    select: { id: true },
  });

  if (existing) {
    await prisma.ongoingProject.update({
      where: { id: project.id },
      data: { archivedAchievementId: existing.id, archivedAt: new Date() },
    });
    return existing;
  }

  const stepPhotos = project.steps.flatMap((step) => parsePhotoList(step.photos));
  const uniquePhotos = Array.from(new Set(stepPhotos));
  const latestStepVideo = [...project.steps]
    .reverse()
    .find((step) => step.videoUrl?.trim())?.videoUrl ?? null;

  const achievementNumber = await getAvailableAchievementNumber(project.number);
  const completedAt = project.steps.at(-1)?.date ?? new Date();

  const created = await prisma.$transaction(async (tx) => {
    const achievement = await tx.achievement.create({
      data: {
        number: achievementNumber,
        name: project.title,
        category: normalizeProjectCategory(project.category),
        location: toAchievementLocation(project),
        region: project.region,
        lat: project.lat,
        lng: project.lng,
        description: project.description,
        completedAt,
        photos: JSON.stringify(uniquePhotos),
        videoUrl: project.inaugurationVideoUrl ?? latestStepVideo,
        sourceProjectId: project.id,
        note: "Archivé automatiquement depuis Travaux en cours.",
      },
      select: { id: true },
    });

    await tx.ongoingProject.update({
      where: { id: project.id },
      data: {
        archivedAt: new Date(),
        archivedAchievementId: achievement.id,
        progress: 100,
      },
    });

    await tx.donationCampaign.updateMany({
      where: {
        projectId: project.id,
        type: "cagnotte",
      },
      data: { isActive: false },
    });

    return achievement;
  });

  return created;
}
