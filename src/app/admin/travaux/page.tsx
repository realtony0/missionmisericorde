import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminTravauxPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const projects = await prisma.ongoingProject.findMany({
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Travaux en cours</h1>
      <Link
        href="/admin/travaux/new"
        className="inline-block mb-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
      >
        Nouveau projet
      </Link>
      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-white rounded-xl border border-primary/10 flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-dark">
                {p.number ? `Projet n°${p.number} - ` : ""}
                {p.title}
              </div>
              <div className="text-sm text-dark/70">
                {p.category} - {p.progress} % - {p.status} - {p.steps.length} étape(s)
              </div>
              {p.archivedAt && (
                <div className="text-xs text-primary mt-1">
                  Archivé le {new Date(p.archivedAt).toLocaleDateString("fr-FR")}
                </div>
              )}
            </div>
            <Link href={`/admin/travaux/${p.id}`} className="text-primary text-sm hover:underline">
              Modifier
            </Link>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-dark/70">Aucun projet. Créez-en un pour le suivi.</p>
        )}
      </div>
    </div>
  );
}
