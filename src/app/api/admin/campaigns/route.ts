import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function toOptionalString(value: unknown) {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value !== "string") return String(value);
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toNumberOrZero(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeCampaignType(value: unknown) {
  return value === "libre" ? "libre" : "cagnotte";
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title = toOptionalString(body.title);
  if (!title) {
    return NextResponse.json({ error: "Le titre est requis." }, { status: 400 });
  }

  try {
    const campaign = await prisma.donationCampaign.create({
      data: {
        title,
        description: toOptionalString(body.description),
        targetAmount: toNumberOrZero(body.targetAmount),
        currentAmount: 0,
        type: normalizeCampaignType(body.type),
        projectId: toOptionalString(body.projectId),
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json({ id: campaign.id });
  } catch (error) {
    console.error("Campaign create error", error);
    return NextResponse.json(
      { error: "Impossible de créer cette campagne." },
      { status: 500 }
    );
  }
}
