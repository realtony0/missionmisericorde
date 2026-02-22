import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPhoneFromWaUrl } from "@/lib/format";

export const metadata: Metadata = {
  title: "Rejoindre nos groupes | Mission Miséricorde",
  description: "Rejoignez les groupes de Mission Miséricorde pour suivre nos actualités et projets.",
};
export const dynamic = "force-dynamic";

const DEFAULT_WHATSAPP_MAIN = "https://wa.me/221786347307";
const DEFAULT_WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb5KlXaEgGfRrY7rpp3P";

async function getWhatsAppLinks() {
  const [main, group1, group2, group3] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "whatsapp_main" } }),
    prisma.siteSetting.findUnique({ where: { key: "whatsapp_group_1" } }),
    prisma.siteSetting.findUnique({ where: { key: "whatsapp_group_2" } }),
    prisma.siteSetting.findUnique({ where: { key: "whatsapp_group_3" } }),
  ]);
  return {
    main: main?.value?.trim() || DEFAULT_WHATSAPP_MAIN,
    group1: group1?.value?.trim() || DEFAULT_WHATSAPP_CHANNEL,
    group2: group2?.value?.trim() || "",
    group3: group3?.value?.trim() || "",
    phoneLabel: formatPhoneFromWaUrl(main?.value?.trim() || DEFAULT_WHATSAPP_MAIN) || "Nous contacter",
  };
}

export default async function RejoindrePage() {
  const links = await getWhatsAppLinks();

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="mx-auto max-w-4xl page-hero text-center">
        <span className="eyebrow">Communauté</span>
        <h1 className="page-title mt-4">Rejoindre nos groupes</h1>
        <p className="page-subtitle mx-auto max-w-2xl">
          Suivez les actualités de Mission Miséricorde, les nouvelles réalisations et les prochaines cagnottes.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-2xl sm:mt-10">
        <div className="surface-card space-y-3">
          <a
            href={links.main}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base"
          >
            Nous contacter — {links.phoneLabel}
          </a>
          {links.group1 && (
            <a
              href={links.group1}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full text-base"
            >
              Rejoindre la chaîne WhatsApp
            </a>
          )}
          {links.group2 && (
            <a
              href={links.group2}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full text-base"
            >
              Rejoindre le groupe 2
            </a>
          )}
          {links.group3 && (
            <a
              href={links.group3}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full text-base"
            >
              Rejoindre le groupe 3
            </a>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-ink/75">
          Les liens sont modifiables depuis l&apos;interface d&apos;administration.
        </p>
      </section>
    </div>
  );
}
