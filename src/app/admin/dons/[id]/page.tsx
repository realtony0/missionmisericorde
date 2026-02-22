import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditCampaignForm from "./EditCampaignForm";

export default async function AdminEditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const [campaign, projects] = await Promise.all([
    prisma.donationCampaign.findUnique({ where: { id } }),
    prisma.ongoingProject.findMany({
      where: { status: "En cours" },
      orderBy: [{ number: "asc" }, { updatedAt: "desc" }],
      select: { id: true, number: true, title: true },
    }),
  ]);
  if (!campaign) notFound();

  return (
    <div>
      <Link href="/admin/dons" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux dons
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">Modifier : {campaign.title}</h1>
      <EditCampaignForm campaign={campaign} projects={projects} />
    </div>
  );
}
