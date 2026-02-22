import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";
import DonationSection from "@/components/DonationSection";

export const metadata: Metadata = {
  title: "Faire un don | Mission Miséricorde",
  description: "Soutenez nos projets par cagnotte ou don libre. Sécurisé et transparent.",
};
export const dynamic = "force-dynamic";

const DEFAULT_PAYMENT_METHODS = [
  "Wave + Orange Money : +221 78 634 73 07",
  "Wave + Orange Money : +221 78 750 85 91",
  "Bénéficiaire : Mohammad Nazir",
  "PayPal : magendey@gmail.com",
  "Virement ou remise de chèque : contactez-nous.",
].join("\n");

type PaymentProvider =
  | "mobile_money"
  | "orange_money"
  | "wave"
  | "paypal"
  | "bank"
  | "beneficiary"
  | "other";

type PaymentOption = {
  id: string;
  provider: PaymentProvider;
  label: string;
  value: string;
  raw: string;
};

function detectProvider(label: string): PaymentProvider {
  const lower = label.toLowerCase();
  const compact = lower.replace(/[\s._-]/g, "");
  const hasOrange =
    lower.includes("orange money") ||
    lower.startsWith("om ") ||
    lower === "om" ||
    compact === "om" ||
    lower.includes("orange");
  const hasWave = lower.includes("wave");

  if (hasOrange && hasWave) return "mobile_money";

  if (hasOrange) {
    return "orange_money";
  }
  if (hasWave) return "wave";
  if (lower.includes("paypal")) return "paypal";
  if (lower.includes("virement") || lower.includes("chèque") || lower.includes("cheque") || lower.includes("bank")) {
    return "bank";
  }
  if (lower.includes("bénéficiaire") || lower.includes("beneficiaire")) return "beneficiary";
  return "other";
}

function normalizeProviderLabel(provider: PaymentProvider, fallback: string): string {
  if (provider === "mobile_money") return "Wave + Orange Money";
  if (provider === "orange_money") return "Orange Money";
  if (provider === "wave") return "Wave";
  if (provider === "paypal") return "PayPal";
  if (provider === "bank") return "Virement / chèque";
  if (provider === "beneficiary") return "Bénéficiaire";
  return fallback;
}

function parsePaymentMethods(raw: string): PaymentOption[] {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const options = lines.map((line, index) => {
    const separator = line.indexOf(":");
    const label = separator >= 0 ? line.slice(0, separator).trim() : line;
    const value = separator >= 0 ? line.slice(separator + 1).trim() : "";
    const provider = detectProvider(label);
    return {
      id: `payment-${index}`,
      provider,
      label: normalizeProviderLabel(provider, label),
      value,
      raw: line,
    } satisfies PaymentOption;
  });

  const hasWaveOrCombined = options.some(
    (option) => option.provider === "wave" || option.provider === "mobile_money"
  );
  const orangeIndexes = options
    .map((option, index) => (option.provider === "orange_money" ? index : -1))
    .filter((index) => index >= 0);

  // If admin entered Orange Money only for multiple numbers,
  // assume those numbers accept both Wave and Orange Money.
  if (!hasWaveOrCombined && orangeIndexes.length >= 2) {
    for (const index of orangeIndexes) {
      options[index] = {
        ...options[index],
        provider: "mobile_money",
        label: "Wave + Orange Money",
      };
    }
  } else if (!hasWaveOrCombined && orangeIndexes.length === 1) {
    const firstOrangeIndex = orangeIndexes[0];
    options[firstOrangeIndex] = {
      ...options[firstOrangeIndex],
      provider: "mobile_money",
      label: "Wave + Orange Money",
    };
  }

  return options;
}

function providerLogos(provider: PaymentProvider): string[] {
  if (provider === "mobile_money") return ["/logos/wave.png", "/logos/orange-money.svg"];
  if (provider === "orange_money") return ["/logos/orange-money.svg"];
  if (provider === "wave") return ["/logos/wave.png"];
  if (provider === "paypal") return ["/logos/paypal.svg"];
  if (provider === "bank") return ["/logos/bank-transfer.svg"];
  return [];
}

function providerName(provider: PaymentProvider, fallback: string): string {
  if (provider === "mobile_money") return "Wave + Orange Money";
  if (provider === "orange_money") return "Orange Money";
  if (provider === "wave") return "Wave";
  if (provider === "paypal") return "PayPal";
  if (provider === "bank") return "Virement";
  return fallback;
}

export default async function FaireUnDonPage() {
  const [campaigns, ongoingProjects, settings] = await Promise.all([
    prisma.donationCampaign.findMany({
      where: { isActive: true },
      include: {
        project: {
          select: { id: true, number: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.ongoingProject.findMany({
      where: { status: "En cours" },
      select: { id: true, number: true, title: true },
    }),
    prisma.siteSetting.findMany({
      where: { key: { in: ["payment_methods", "payment_security"] } },
    }),
  ]);

  const settingsMap = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]));
  const paymentMethods = settingsMap.payment_methods ?? DEFAULT_PAYMENT_METHODS;
  const paymentSecurity =
    settingsMap.payment_security ??
    "Les paiements sont traités via des prestataires reconnus. Les informations de don sont protégées et les montants suivis en toute transparence.";
  const paymentOptions = parsePaymentMethods(paymentMethods);
  const paymentLines = paymentOptions.map((option) =>
    option.value ? `${providerName(option.provider, option.label)} : ${option.value}` : option.raw
  );
  const orangeLines = paymentOptions
    .filter((option) => option.provider === "orange_money" || option.provider === "mobile_money")
    .map((option) => option.value || option.raw);
  const waveLines = paymentOptions
    .filter((option) => option.provider === "wave" || option.provider === "mobile_money")
    .map((option) => option.value || option.raw);
  const paypalLine = paymentOptions.find((option) => option.provider === "paypal");

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="mx-auto max-w-4xl page-hero">
        <span className="eyebrow">Soutenir l&apos;association</span>
        <h1 className="page-title mt-4">Faire un don</h1>
        <p className="page-subtitle max-w-3xl">
          Deux modes de contribution sont disponibles: une cagnotte ponctuelle pour un projet précis, ou un don libre permanent affecté selon les besoins prioritaires.
        </p>
      </section>

      <section className="mx-auto mt-8 max-w-4xl sm:mt-10">
        <DonationSection campaigns={campaigns} ongoingProjects={ongoingProjects} />
      </section>

      <section className="mx-auto mt-8 max-w-4xl sm:mt-10">
        <div className="surface-card">
          <h2 className="text-2xl font-bold">Moyens de paiement</h2>
          {paymentOptions.length > 0 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => {
                const logos = providerLogos(option.provider);
                return (
                <div key={option.id} className="rounded-xl border border-primary/20 bg-white p-3">
                  <div className="flex items-center gap-3">
                    {logos.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {logos.map((logoSrc) => (
                          <Image
                            key={`${option.id}-${logoSrc}`}
                            src={logoSrc}
                            alt={`Logo ${option.label}`}
                            width={44}
                            height={44}
                            className="h-10 w-auto max-w-[104px] rounded-md border border-primary/20 object-contain bg-white px-2 py-1"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-11 w-11 rounded-md border border-primary/20 bg-surface-strong" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-dark">{option.label}</p>
                      <p className="text-sm text-ink/80">{option.value || option.raw}</p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
          <ul className="mt-3 space-y-1.5 text-sm sm:text-base">
            {paymentLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-primary/20 bg-surface-strong p-4">
            <h3 className="text-lg font-bold">Instructions d&apos;envoi</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm sm:text-base">
              <li>Choisissez une cagnotte ponctuelle ou un don libre permanent.</li>
              <li>Choisissez un moyen de paiement dans la liste ci-dessus.</li>
              <li>Envoyez directement votre montant au numéro ou au compte correspondant.</li>
              <li>Les deux numéros mobiles acceptent Wave et Orange Money.</li>
            </ol>
            {orangeLines.length > 0 && (
              <div className="mt-4 rounded-lg border border-primary/20 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Orange Money
                </p>
                <ul className="mt-1 text-sm">
                  {orangeLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {waveLines.length > 0 && (
              <div className="mt-3 rounded-lg border border-primary/20 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Wave
                </p>
                <ul className="mt-1 text-sm">
                  {waveLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {paypalLine && (
              <div className="mt-3 rounded-lg border border-primary/20 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">PayPal</p>
                <p className="mt-1 text-sm">
                  {providerName(paypalLine.provider, paypalLine.label)}
                  {paypalLine.value ? ` : ${paypalLine.value}` : ""}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <h3 className="text-lg font-bold">Sécurité et transparence</h3>
            <p className="mt-2 text-sm sm:text-base">{paymentSecurity}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
