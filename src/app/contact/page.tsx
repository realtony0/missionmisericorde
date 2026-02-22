import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPhoneFromWaUrl } from "@/lib/format";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Mission Miséricorde",
  description: "Contactez l'association Mission Miséricorde par email ou formulaire.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "contact_email",
          "whatsapp_main",
          "social_facebook",
          "social_instagram",
          "social_youtube",
          "social_tiktok",
        ],
      },
    },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const contactEmail = map.contact_email ?? "missionmisericorde2025@gmail.com";
  const whatsappUrl = map.whatsapp_main ?? "https://wa.me/221786347307";
  const phoneLabel = formatPhoneFromWaUrl(whatsappUrl) || "Nous écrire";
  const socials = [
    { key: "social_facebook", label: "Facebook" },
    { key: "social_instagram", label: "Instagram" },
    { key: "social_youtube", label: "YouTube" },
    { key: "social_tiktok", label: "TikTok" },
  ].filter((social) => Boolean(map[social.key]));

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="mx-auto max-w-4xl page-hero">
        <span className="eyebrow">Contact</span>
        <h1 className="page-title mt-4">Parlons de votre contribution</h1>
        <p className="page-subtitle max-w-3xl">
          Une question, un projet ou une idée ? Contactez-nous par email, WhatsApp ou via le formulaire ci-dessous.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl sm:mt-10">
        <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${contactEmail}`}
              className="surface-card flex min-h-[108px] flex-col justify-center transition hover:-translate-y-0.5"
            >
              <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary/80">
                Email
              </span>
              <span className="break-all text-sm font-semibold text-dark sm:text-base">
                {contactEmail}
              </span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card flex min-h-[108px] flex-col justify-center transition hover:-translate-y-0.5"
            >
              <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary/80">
                Téléphone / Message
              </span>
              <span className="text-sm font-semibold text-dark sm:text-base">
                {phoneLabel}
              </span>
            </a>
          </div>

          <div className="surface-card mt-6 sm:mt-8">
            <h2 className="text-2xl font-bold text-dark">
              Formulaire de contact
            </h2>
            <p className="mt-2 text-sm sm:text-base">
              Le formulaire ouvre votre messagerie avec le message prérempli.
            </p>
            <div className="mt-5 sm:mt-6">
            <ContactForm contactEmail={contactEmail} />
            </div>
          </div>

          <div className="surface-card mt-6">
            <h2 className="text-2xl font-bold text-dark">Réseaux sociaux</h2>
            {socials.length === 0 ? (
              <p className="mt-3 text-sm text-ink/75">Aucun lien social publié pour le moment.</p>
            ) : (
              <ul className="mt-4 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <li key={social.key}>
                    <a
                      href={map[social.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 sm:text-base"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </section>
    </div>
  );
}
