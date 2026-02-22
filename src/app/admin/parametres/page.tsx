import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import WhatsAppLinksForm from "./WhatsAppLinksForm";
import ContactFormSettings from "./ContactFormSettings";
import SocialLinksForm from "./SocialLinksForm";
import DonationSettingsForm from "./DonationSettingsForm";

const DEFAULT_PAYMENT_METHODS = [
  "Wave + Orange Money : +221 78 634 73 07",
  "Wave + Orange Money : +221 78 750 85 91",
  "Bénéficiaire : Mohammad Nazir",
  "PayPal : magendey@gmail.com",
  "Virement ou remise de chèque : contactez-nous.",
].join("\n");
const DEFAULT_WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029Vb5KlXaEgGfRrY7rpp3P";

export default async function AdminParametresPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "whatsapp_main",
          "whatsapp_group_1",
          "whatsapp_group_2",
          "whatsapp_group_3",
          "contact_email",
          "social_facebook",
          "social_instagram",
          "social_youtube",
          "social_tiktok",
          "payment_methods",
          "payment_security",
        ],
      },
    },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark mb-6">Paramètres</h1>
      <section className="mb-8">
        <h2 className="text-lg font-bold text-dark mb-4">Contact (page publique)</h2>
        <ContactFormSettings
          initialEmail={map.contact_email ?? "missionmisericorde2025@gmail.com"}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-bold text-dark mb-4">Liens WhatsApp</h2>
        <WhatsAppLinksForm
          initial={{
            whatsapp_main: map.whatsapp_main ?? "https://wa.me/221786347307",
            whatsapp_group_1: map.whatsapp_group_1?.trim() || DEFAULT_WHATSAPP_CHANNEL,
            whatsapp_group_2: map.whatsapp_group_2 ?? "",
            whatsapp_group_3: map.whatsapp_group_3 ?? "",
          }}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-bold text-dark mb-4">Réseaux sociaux (page Contact)</h2>
        <SocialLinksForm
          initial={{
            social_facebook: map.social_facebook ?? "",
            social_instagram: map.social_instagram ?? "",
            social_youtube: map.social_youtube ?? "",
            social_tiktok: map.social_tiktok ?? "",
          }}
        />
      </section>
      <section className="mb-8">
        <h2 className="text-lg font-bold text-dark mb-4">Dons (page publique)</h2>
        <DonationSettingsForm
          initial={{
            payment_methods: map.payment_methods ?? DEFAULT_PAYMENT_METHODS,
            payment_security:
              map.payment_security ??
              "Les paiements sont traités via des prestataires reconnus. Les informations de don sont protégées et les montants suivis en toute transparence.",
          }}
        />
      </section>
    </div>
  );
}
