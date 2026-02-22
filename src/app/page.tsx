"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import KeyFigures from "@/components/KeyFigures";
import Lightbox from "@/components/Lightbox";

const GALLERY = [
  "/images/photo-1.jpg",
  "/images/photo-2.jpg",
  "/images/photo-3.jpg",
  "/images/photo-4.jpg",
  "/images/photo-5.jpg",
  "/images/photo-6.jpg",
  "/images/photo-7.jpg",
  "/images/photo-8.jpg",
  "/images/photo-9.jpg",
  "/images/photo-10.jpg",
  "/images/photo-11.jpg",
];

const domains = [
  {
    title: "Ouvrages hydrauliques",
    description: "Puits et mini-forages pour l'accès durable à l'eau potable.",
  },
  {
    title: "Mosquées",
    description: "Construction et rénovation de lieux de culte utiles à toute la communauté.",
  },
  {
    title: "Éducation islamique",
    description: "Soutien aux internats coraniques, aux élèves et aux enseignants.",
  },
  {
    title: "Environnement",
    description: "Plantation d'arbres et actions de préservation des ressources.",
  },
];

export default function HomePage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image src="/images/photo-4.jpg" alt="" fill className="object-cover object-center" priority sizes="100vw" />
          <div className="absolute inset-0 bg-dark/70" />
        </div>

        <div className="page-shell relative z-10 flex min-h-[72vh] flex-col justify-center py-14 sm:py-20">
          <span className="eyebrow w-fit border border-white/30 bg-white/10 text-white">
            Association caritative au Sénégal
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
            Sadaqa jariya utile, traçable et durable
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90 sm:text-xl">
            Mission Miséricorde construit des ouvrages qui servent dans le temps: puits, mini-forages, mosquées, internats et actions environnementales.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/faire-un-don" className="btn-accent text-base">
              Faire un don
            </Link>
            <Link href="/travaux-en-cours" className="btn-outline border-white/50 bg-white/10 text-white hover:bg-white/10">
              Suivre les travaux
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell py-12 sm:py-14">
        <div className="page-hero">
          <span className="eyebrow">Qui sommes-nous</span>
          <h2 className="page-title mt-4">Mission Miséricorde</h2>
          <p className="page-subtitle max-w-4xl">
            Mission Miséricorde est une association caritative à but non lucratif, créée le <strong>24 avril 2025</strong>. Nous organisons des projets de <strong>sadaqa jariya</strong> avec suivi photo, historique des étapes et publication des inaugurations.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="page-shell">
          <div className="mb-8 flex flex-col items-start gap-2 sm:mb-10 sm:items-center">
            <span className="eyebrow">Impact</span>
            <h2 className="section-title sm:text-center">
            Chiffres clés
            </h2>
          </div>
          <KeyFigures />
        </div>
      </section>

      <section className="page-shell py-12 sm:py-14">
        <div className="mb-8 flex flex-col items-start gap-2 sm:items-center">
          <span className="eyebrow">Notre mission</span>
          <h2 className="section-title sm:text-center">Nos domaines d&apos;action</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {domains.map((d) => (
            <article key={d.title} className="surface-card">
              <h3 className="text-2xl font-bold">{d.title}</h3>
              <p className="mt-2 text-sm leading-relaxed">{d.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-14">
        <div className="page-shell">
          <div className="mb-8 flex flex-col items-start gap-2 sm:items-center">
            <span className="eyebrow">Galerie</span>
            <h2 className="section-title sm:text-center">Réalisations en images</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {GALLERY.map((src, i) => (
              <button
                key={src}
                type="button"
                className={`relative overflow-hidden rounded-xl border border-primary/20 transition hover:opacity-95 ${
                  i % 5 === 0 ? "col-span-2 row-span-2 aspect-[16/10] sm:col-span-1 sm:row-span-1 sm:aspect-[4/3]" : "aspect-[4/3]"
                }`}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={src}
                  alt={`Réalisation Mission Miséricorde ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <Lightbox
          images={GALLERY}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + GALLERY.length) % GALLERY.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % GALLERY.length)}
        />
      )}

      <section className="page-shell pb-14 pt-4 sm:pb-16">
        <div className="surface-card-muted text-center">
          <h2 className="text-2xl font-bold">Transparence</h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm sm:text-base">
            Projets numérotés, photos vérifiables et mises à jour régulières. Les financements sont suivis via cagnottes ponctuelles et dons libres permanents.
          </p>
        </div>
      </section>
    </>
  );
}
