import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
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
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalBoolean(value: unknown) {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
}

function normalizeCampaignType(value: unknown) {
  if (value === undefined) return undefined;
  return value === "libre" ? "libre" : "cagnotte";
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

  if ("title" in body) {
    const title = toOptionalString(body.title);
    if (!title) {
      return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
    }
    data.title = title;
  }

  if ("description" in body) data.description = toOptionalString(body.description);
  if ("targetAmount" in body) data.targetAmount = toOptionalNumber(body.targetAmount) ?? 0;
  if ("currentAmount" in body) data.currentAmount = toOptionalNumber(body.currentAmount) ?? 0;
  if ("type" in body) data.type = normalizeCampaignType(body.type);
  if ("projectId" in body) data.projectId = toOptionalString(body.projectId);
  if ("isActive" in body) data.isActive = toOptionalBoolean(body.isActive);

  try {
    await prisma.donationCampaign.update({
      where: { id },
      data: data as Prisma.DonationCampaignUpdateInput,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Campaign update error", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour cette campagne." },
      { status: 500 }
    );
  }
}
