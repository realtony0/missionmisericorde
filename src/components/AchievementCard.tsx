"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "./Lightbox";

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

function parsePhotos(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    return [];
  }
  return [];
}

export default function AchievementCard({ a }: { a: Achievement }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photos = parsePhotos(a.photos);
  const firstPhoto = photos[0] ?? null;
  const mapsUrl =
    typeof a.lat === "number" && typeof a.lng === "number"
      ? `https://www.google.com/maps?q=${a.lat},${a.lng}`
      : null;

  const locationParts = [a.location, a.village, a.commune, a.department, a.region].filter(Boolean);
  const locationLabel = locationParts.length > 0 ? locationParts.join(", ") : "Non renseignée";
  const dateLabel = a.completedAt ? new Date(a.completedAt).toLocaleDateString("fr-FR") : "Non renseignée";
  const descriptionLabel = (a.description ?? a.note ?? "").trim() || "Non renseignée";

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-primary/20 bg-white">
        {firstPhoto && (
          <div className="relative aspect-[16/10] border-b border-primary/10">
            <Image
              src={firstPhoto}
              alt={`${a.name} - photo principale`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="space-y-2 p-4 text-sm text-ink/80">
          <p>
            <strong className="text-dark">Numéro :</strong> {a.number}
          </p>
          <p>
            <strong className="text-dark">Nom :</strong> {a.name}
          </p>
          <p>
            <strong className="text-dark">Localisation :</strong> {locationLabel}
          </p>
          <p>
            <strong className="text-dark">Date :</strong> {dateLabel}
          </p>
          <p>
            <strong className="text-dark">Description courte :</strong> {descriptionLabel}
          </p>
          <div className="pt-1">
            <strong className="text-dark">Galerie photos :</strong>{" "}
            <button
              type="button"
              onClick={() => {
                if (photos.length > 0) {
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }
              }}
              disabled={photos.length === 0}
              className={`ml-1 rounded-md px-2 py-1 text-xs font-semibold ${
                photos.length > 0
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "bg-surface-strong text-ink/60"
              }`}
            >
              {photos.length > 0 ? `Voir (${photos.length})` : "0"}
            </button>
          </div>
        </div>

        {mapsUrl && (
          <div className="border-t border-primary/10 p-4 pt-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Ouvrir sur Google Maps
            </a>
          </div>
        )}
      </article>

      {lightboxOpen && photos.length > 0 && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + photos.length) % photos.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % photos.length)}
        />
      )}
    </>
  );
}
