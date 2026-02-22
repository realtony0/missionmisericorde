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

function toOptionalBoolean(value: unknown) {
  if (value === undefined) return undefined;
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};

  if ("number" in body) data.number = toOptionalNumber(body.number);

  if ("title" in body) {
    const title = toOptionalString(body.title);
    if (!title) {
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
    data.title = title;
  }

  if ("category" in body) data.category = normalizeProjectCategory(body.category);
  if ("location" in body) data.location = toOptionalString(body.location);
  if ("region" in body) data.region = toOptionalString(body.region);
  if ("lat" in body) data.lat = toOptionalNumber(body.lat);
  if ("lng" in body) data.lng = toOptionalNumber(body.lng);
  if ("startDate" in body) data.startDate = toOptionalDate(body.startDate);
  if ("description" in body) data.description = toOptionalString(body.description);
  if ("targetAmount" in body) data.targetAmount = toOptionalNumber(body.targetAmount);
  if ("currentAmount" in body) data.currentAmount = toOptionalNumber(body.currentAmount);
  if ("inaugurationVideoUrl" in body) data.inaugurationVideoUrl = toOptionalString(body.inaugurationVideoUrl);
  if ("archiveToAchievements" in body) data.archiveToAchievements = toOptionalBoolean(body.archiveToAchievements);

  if ("status" in body) data.status = normalizeStatus(body.status);
  if ("progress" in body) data.progress = clampProgress(body.progress, 0);

  if (data.status === "Terminé" && !("progress" in data)) {
    data.progress = 100;
  }

  if ("steps" in body) {
    data.steps = {
      deleteMany: {},
      create: normalizeSteps(body.steps),
    };
  }

  try {
    const updated = await prisma.ongoingProject.update({
      where: { id },
      data: data as Prisma.OngoingProjectUpdateInput,
      select: { id: true },
    });

    const archived = await archiveProjectIfNeeded(updated.id);

    return NextResponse.json({ ok: true, archivedAchievementId: archived?.id ?? null });
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
    console.error("Project update error", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour ce projet." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.ongoingProject.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Project delete error", error);
    return NextResponse.json(
      { error: "Impossible de supprimer ce projet." },
      { status: 500 }
    );
  }
}
