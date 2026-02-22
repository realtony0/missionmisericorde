import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatPhoneFromWaUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "À propos | Mission Miséricorde",
  description: "Association créée le 24 avril 2025, but non lucratif, sadaqa jariya au Sénégal.",
};

export const dynamic = "force-dynamic";

export default async function AProposPage() {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["contact_email", "whatsapp_main"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const whatsappUrl = map.whatsapp_main ?? "https://wa.me/221786347307";
  const phoneLabel = formatPhoneFromWaUrl(whatsappUrl) || "Nous écrire";

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="mx-auto max-w-4xl page-hero">
        <span className="eyebrow">À propos</span>
        <h1 className="page-title mt-4">Une association créée pour des œuvres durables</h1>
        <p className="page-subtitle max-w-3xl">
          Mission Miséricorde est une association caritative à but non lucratif, créée le <strong>24 avril 2025</strong>. Elle agit pour la <strong>sadaqa jariya</strong> au Sénégal avec un engagement de suivi transparent et régulier.
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-5xl gap-6 sm:mt-12 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card">
          <span className="eyebrow">Président</span>
          <h2 className="mt-3 text-3xl font-bold text-primary">Mohammad Nazir Agendey</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm sm:text-base">
              <li>Hafiz du Coran (mémorisation à 12 ans)</li>
              <li>Professeur de tajwid</li>
              <li>Baccalauréat scientifique</li>
              <li>Université Cheikh Anta Diop (MPI)</li>
              <li>Licence en transmission de données et sécurité informatique</li>
          </ul>
        </article>

        <article className="surface-card">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-primary/10 bg-primary/10">
            <Image
              src="/images/photo-presi.jpeg"
              alt="Mohammad Nazir Agendey"
              fill
              className="object-cover object-top"
              sizes="(max-width:1024px) 100vw, 40vw"
            />
          </div>
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-lg font-bold text-primary">Vice-présidente</h3>
            <p className="mt-1 text-sm sm:text-base">Aissata Hamath Wane</p>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-8 max-w-5xl sm:mt-10">
        <div className="surface-card-muted text-center">
          <p className="text-sm uppercase tracking-wide text-primary">Contact direct</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xl font-bold text-primary hover:underline"
          >
            {phoneLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
