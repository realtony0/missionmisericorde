import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeProjectCategory, parsePhotoList } from "@/lib/projects";
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const data: Record<string, unknown> = {};

  if ("name" in body) {
    const name = toOptionalString(body.name);
    if (!name) {
      return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
    }
    data.name = name;
  }

  if ("number" in body) data.number = toOptionalNumber(body.number);
  if ("category" in body) data.category = normalizeProjectCategory(body.category);
  if ("description" in body) data.description = toOptionalString(body.description);
  if ("note" in body) data.note = toOptionalString(body.note);
  if ("videoUrl" in body) data.videoUrl = toOptionalString(body.videoUrl);
  if ("completedAt" in body) data.completedAt = toOptionalDate(body.completedAt);
  if ("location" in body) data.location = toOptionalString(body.location);
  if ("region" in body) data.region = toOptionalString(body.region);
  if ("lat" in body) data.lat = toOptionalNumber(body.lat);
  if ("lng" in body) data.lng = toOptionalNumber(body.lng);

  if ("photos" in body) {
    data.photos = JSON.stringify(parsePhotoList(body.photos));
  }

  try {
    await prisma.achievement.update({
      where: { id },
      data: data as Prisma.AchievementUpdateInput,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Le numéro de réalisation existe déjà." },
        { status: 409 }
      );
    }
    console.error("Achievement update error", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour cette réalisation." },
      { status: 500 }
    );
  }
}
