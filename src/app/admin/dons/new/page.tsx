import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewCampaignForm from "./NewCampaignForm";
import { prisma } from "@/lib/db";

export default async function AdminNewCampaignPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const projects = await prisma.ongoingProject.findMany({
    where: { status: "En cours" },
    orderBy: [{ number: "asc" }, { updatedAt: "desc" }],
    select: { id: true, number: true, title: true },
  });

  return (
    <div>
      <Link href="/admin/dons" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux dons
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">Nouvelle cagnotte</h1>
      <NewCampaignForm projects={projects} />
    </div>
  );
}
