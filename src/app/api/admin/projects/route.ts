import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { archiveProjectIfNeeded, normalizeProjectCategory, parsePhotoList } from "@/lib/projects";
import { Prisma } from "@prisma/client";

function toOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return String(value);
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toOptionalNumber(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return null;
  return numberValue;
}

function toOptionalDate(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function toBooleanWithDefault(value: unknown, fallback: boolean) {
  if (value === undefined) return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function clampProgress(value: unknown, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed < 0) return 0;
  if (parsed > 100) return 100;
  return Math.round(parsed);
}

function normalizeStatus(value: unknown) {
  return value === "Terminé" ? "Terminé" : "En cours";
}

function normalizeSteps(steps: unknown) {
  if (!Array.isArray(steps)) return [];

  return steps.map((rawStep, index) => {
    const data = (rawStep ?? {}) as Record<string, unknown>;
    const description = toOptionalString(data.description) ?? "Mise à jour";
    const title = toOptionalString(data.title);
    const date = toOptionalDate(data.date) ?? new Date();
    const photos = parsePhotoList(data.photos);
    const videoUrl = toOptionalString(data.videoUrl);
    const order = Number.isFinite(Number(data.order)) ? Number(data.order) : index;

    return {
      title,
      date,
      description,
      photos: JSON.stringify(photos),
      videoUrl,
      order,
    };
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = toOptionalString(body.title);
  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }

  const status = normalizeStatus(body.status);
  const progress = status === "Terminé" ? 100 : clampProgress(body.progress, 0);
  const steps = normalizeSteps(body.steps);

  try {
    const project = await prisma.ongoingProject.create({
      data: {
        number: toOptionalNumber(body.number),
        title,
        category: normalizeProjectCategory(body.category),
        location: toOptionalString(body.location),
        region: toOptionalString(body.region),
        lat: toOptionalNumber(body.lat),
        lng: toOptionalNumber(body.lng),
        startDate: toOptionalDate(body.startDate),
        description: toOptionalString(body.description),
        targetAmount: toOptionalNumber(body.targetAmount),
        currentAmount: toOptionalNumber(body.currentAmount) ?? 0,
        progress,
        status,
        inaugurationVideoUrl: toOptionalString(body.inaugurationVideoUrl),
        archiveToAchievements: toBooleanWithDefault(body.archiveToAchievements, true),
        steps: steps.length > 0 ? { create: steps } : undefined,
      },
      select: { id: true, status: true },
    });

    const archived = await archiveProjectIfNeeded(project.id);

    return NextResponse.json({ id: project.id, archivedAchievementId: archived?.id ?? null });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Le numéro du projet existe déjà." },
        { status: 409 }
      );
    }
    console.error("Project create error", error);
    return NextResponse.json(
      { error: "Impossible de créer le projet." },
      { status: 500 }
    );
  }
}
