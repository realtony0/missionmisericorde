import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminRealisationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const achievements = await prisma.achievement.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Réalisations</h1>
      <p className="text-dark/70 text-sm mb-4">
        Modifier les réalisations (numéro, date, localisation, photos, vidéos, description) depuis cette liste.
      </p>
      <Link
        href="/admin/realisations/new"
        className="inline-block mb-4 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90"
      >
        Nouvelle réalisation
      </Link>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-primary/20">
              <th className="text-left py-2">N°</th>
              <th className="text-left py-2">Nom</th>
              <th className="text-left py-2">Région</th>
              <th className="text-left py-2">Catégorie</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((a) => (
              <tr key={a.id} className="border-b border-primary/10">
                <td className="py-2">{a.number}</td>
                <td className="py-2 font-medium">{a.name}</td>
                <td className="py-2 text-dark/80">{a.region}</td>
                <td className="py-2">{a.category}</td>
                <td className="py-2">
                  <Link
                    href={`/admin/realisations/${a.id}`}
                    className="text-primary hover:underline"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
