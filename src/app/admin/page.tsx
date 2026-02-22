import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [achievementsCount, projectsCount, campaignsCount] = await Promise.all([
    prisma.achievement.count(),
    prisma.ongoingProject.count(),
    prisma.donationCampaign.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/realisations"
          className="p-6 bg-white rounded-xl border border-primary/10 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-primary">{achievementsCount}</div>
          <div className="text-dark/80 text-sm">Réalisations</div>
        </Link>
        <Link
          href="/admin/travaux"
          className="p-6 bg-white rounded-xl border border-primary/10 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-primary">{projectsCount}</div>
          <div className="text-dark/80 text-sm">Travaux en cours</div>
        </Link>
        <Link
          href="/admin/dons"
          className="p-6 bg-white rounded-xl border border-primary/10 hover:shadow-md transition"
        >
          <div className="text-3xl font-bold text-primary">{campaignsCount}</div>
          <div className="text-dark/80 text-sm">Cagnottes / Dons</div>
        </Link>
      </div>
    </div>
  );
}
