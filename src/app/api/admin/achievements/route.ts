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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const name = toOptionalString(body.name);
  if (!name) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }

  let number = toOptionalNumber(body.number);
  if (number === null || number === undefined) {
    const highest = await prisma.achievement.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    });
    number = (highest?.number ?? 0) + 1;
  }

  try {
    const achievement = await prisma.achievement.create({
      data: {
        name,
        number,
        category: normalizeProjectCategory(body.category),
        location: toOptionalString(body.location),
        region: toOptionalString(body.region),
        lat: toOptionalNumber(body.lat),
        lng: toOptionalNumber(body.lng),
        note: toOptionalString(body.note),
        description: toOptionalString(body.description),
        completedAt: toOptionalDate(body.completedAt),
        videoUrl: toOptionalString(body.videoUrl),
        photos: JSON.stringify(parsePhotoList(body.photos)),
      },
      select: { id: true },
    });

    return NextResponse.json({ id: achievement.id });
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
    console.error("Achievement create error", error);
    return NextResponse.json(
      { error: "Impossible de créer cette réalisation." },
      { status: 500 }
    );
  }
}
