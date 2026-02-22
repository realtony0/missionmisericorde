import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import RealisationsClient from "@/components/RealisationsClient";

export const metadata: Metadata = {
  title: "Réalisations | Mission Miséricorde",
  description: "Puits, mini-forages, internats, mosquées — nos réalisations au Sénégal.",
};
export const dynamic = "force-dynamic";

export default async function RealisationsPage() {
  const achievements = await prisma.achievement.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="page-hero">
        <span className="eyebrow">Réalisations</span>
        <h1 className="page-title mt-4">Nos projets terminés et documentés</h1>
        <p className="page-subtitle max-w-4xl">
          Puits, mini-forages, internats et mosquées. Utilisez les filtres pour explorer les catégories et la carte pour visualiser les emplacements disponibles.
        </p>
      </section>

      <section className="mt-10 sm:mt-12">
        <RealisationsClient achievements={achievements} />
      </section>
    </div>
  );
}
