import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nos actions | Mission Miséricorde",
  description: "Ouvrages hydrauliques, mosquées, éducation islamique, environnement.",
};

const sections = [
  {
    title: "Ouvrages hydrauliques",
    description:
      "Nous construisons des puits et mini-forages pour offrir un accès durable à l'eau potable dans les villages du Sénégal. Chaque ouvrage est numéroté, géolocalisé et documenté. L'eau est un pilier de la vie et une sadaqa jariya essentielle.",
    image: "/images/photo-3.jpg",
  },
  {
    title: "Mosquées",
    image: null,
    description:
      "La construction et la réhabilitation de mosquées permettent aux communautés de se rassembler pour la prière et l'enseignement. Ces lieux de culte constituent un héritage durable au service des populations.",
  },
  {
    title: "Éducation islamique",
    image: null,
    description:
      "Nous soutenons les internats coraniques et les structures d'enseignement islamique. L'éducation est une œuvre qui se transmet et dont les bienfaits perdurent pour les générations futures.",
  },
  {
    title: "Environnement",
    image: "/images/categories/autres.jpg",
    description:
      "Des actions concrètes pour préserver l'environnement et les ressources naturelles : plantation d'arbres, sensibilisation, projets durables. Prendre soin de la création fait partie de notre engagement.",
  },
];

export default function NosActionsPage() {
  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="page-hero">
        <span className="eyebrow">Nos actions</span>
        <h1 className="page-title mt-4">Quatre domaines d&apos;impact durable</h1>
        <p className="page-subtitle max-w-4xl">
          Nos projets sont pensés pour répondre aux besoins essentiels: accès à l&apos;eau, lieux de culte, transmission du savoir islamique et préservation de l&apos;environnement.
        </p>
      </section>

      <section className="mt-10 space-y-6 sm:mt-12">
        {sections.map((s, i) => (
          <article
            key={s.title}
            className={`surface-card grid items-center gap-6 ${
              i % 2 === 1 ? "md:grid-cols-[1.2fr_1fr]" : "md:grid-cols-[1fr_1.2fr]"
            }`}
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <h2 className="text-3xl font-bold">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed sm:text-base">{s.description}</p>
            </div>
            <div className={`relative h-56 overflow-hidden rounded-2xl border border-primary/20 sm:h-64 ${i % 2 === 1 ? "md:order-1" : ""}`}>
              {s.image ? (
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="h-full w-full bg-surface-strong" />
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 sm:mt-12">
        <div className="surface-card-muted text-center">
          <h2 className="text-2xl font-bold">Suivi transparent</h2>
          <p className="mx-auto mt-2 max-w-3xl text-sm sm:text-base">
            Chaque action est publiée avec ses photos, dates et avancées pour permettre à la communauté de suivre concrètement l&apos;impact des dons.
          </p>
        </div>
      </section>
    </div>
  );
}
