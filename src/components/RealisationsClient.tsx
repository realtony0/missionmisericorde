"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AchievementCard from "./AchievementCard";
const Map = dynamic(() => import("./Map"), { ssr: false });

type Achievement = {
  id: string;
  number: number;
  name: string;
  category: string;
  location: string | null;
  village: string | null;
  commune: string | null;
  department: string | null;
  region: string | null;
  lat: number | null;
  lng: number | null;
  note: string | null;
  description: string | null;
  photos: string;
  videoUrl: string | null;
  completedAt: Date | null;
};

const categories: { value: string; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "Puits", label: "Puits" },
  { value: "Mini_forage", label: "Mini-forage" },
  { value: "Internats", label: "Internats" },
  { value: "Mosquees", label: "Mosquées" },
  { value: "Autres", label: "Autres" },
];

export default function RealisationsClient({ achievements }: { achievements: Achievement[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return achievements;
    return achievements.filter((a) => a.category === filter);
  }, [achievements, filter]);

  const puitsMarkers = useMemo(
    () =>
      achievements
        .filter((a) => (a.category === "Puits" || a.category === "Mini_forage") && typeof a.lat === "number" && typeof a.lng === "number")
        .map((a) => ({
          id: a.id,
          lat: a.lat as number,
          lng: a.lng as number,
          name: `N°${a.number} - ${a.name}`,
        })),
    [achievements]
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="surface-card flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setFilter(c.value)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === c.value
                ? "bg-primary text-white"
                : "border border-primary/20 bg-white text-dark hover:bg-primary/5"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="surface-card">
        <p className="text-sm font-semibold text-ink">
          Carte des puits et mini-forages
        </p>
        {puitsMarkers.length === 0 ? (
          <p className="mt-2 text-sm text-ink/80">Aucune coordonnée disponible pour le moment.</p>
        ) : (
          <div className="mt-3 h-[340px] overflow-hidden rounded-xl border border-primary/20">
            <Map markers={puitsMarkers} />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="surface-card text-center text-sm text-ink/80">
          Aucune réalisation dans cette catégorie pour le moment.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <AchievementCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
