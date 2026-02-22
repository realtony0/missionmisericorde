import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const keys = [
    "whatsapp_main",
    "whatsapp_group_1",
    "whatsapp_group_2",
    "whatsapp_group_3",
    "contact_email",
    "social_facebook",
    "social_instagram",
    "social_youtube",
    "social_tiktok",
    "payment_methods",
    "payment_security",
  ];

  for (const key of keys) {
    const value = body[key];
    if (value === undefined) continue;
    const normalized = typeof value === "string" ? value.trim() : String(value ?? "");
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: normalized },
      update: { value: normalized },
    });
  }
  return NextResponse.json({ ok: true });
}
