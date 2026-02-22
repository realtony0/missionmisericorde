import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDonsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const campaigns = await prisma.donationCampaign.findMany({
    include: {
      project: {
        select: { id: true, number: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Dons / Cagnottes</h1>
      <Link
        href="/admin/dons/new"
        className="inline-block mb-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
      >
        Nouvelle cagnotte
      </Link>
      <div className="space-y-4">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-white rounded-xl border border-primary/10 flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-dark">{c.title}</div>
              <div className="text-sm text-dark/70">
                {c.type} — {c.currentAmount.toLocaleString("fr-SN")} FCFA /{" "}
                {c.targetAmount.toLocaleString("fr-SN")} FCFA —{" "}
                {c.isActive ? "Active" : "Inactive"}
              </div>
              {c.project && (
                <div className="text-xs text-primary mt-1">
                  Liée à {c.project.number ? `Projet n°${c.project.number} - ` : ""}
                  {c.project.title}
                </div>
              )}
            </div>
            <Link href={`/admin/dons/${c.id}`} className="text-primary text-sm hover:underline">
              Modifier
            </Link>
          </div>
        ))}
        {campaigns.length === 0 && (
          <p className="text-dark/70">Aucune cagnotte. Créez-en une pour la page Faire un don.</p>
        )}
      </div>
    </div>
  );
}
