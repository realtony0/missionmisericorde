import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Providers } from "@/components/Providers";
import { prisma } from "@/lib/db";
import { formatPhoneFromWaUrl } from "@/lib/format";

const sourceSans3 = Source_Sans_3({ subsets: ["latin"], variable: "--font-body" });
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Mission Miséricorde | Sadaqa jariya au Sénégal",
  description:
    "Association caritative à but non lucratif. Ouvrages hydrauliques, mosquées, éducation islamique, environnement. Créée le 24 avril 2025.",
  openGraph: {
    title: "Mission Miséricorde | Sadaqa jariya au Sénégal",
    description: "Association caritative à but non lucratif. Sadaqa jariya au Sénégal.",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["contact_email", "whatsapp_main"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const contactEmail = map.contact_email ?? "missionmisericorde2025@gmail.com";
  const whatsappUrl = map.whatsapp_main ?? "https://wa.me/221786347307";
  const phoneLabel = formatPhoneFromWaUrl(whatsappUrl) || "Nous écrire";

  return (
    <html lang="fr">
      <body
        className={`${sourceSans3.variable} ${libreBaskerville.variable} font-sans antialiased bg-cream text-dark min-h-screen flex flex-col`}
      >
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        <Providers>
          <Navbar />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer contactEmail={contactEmail} whatsappUrl={whatsappUrl} phoneLabel={phoneLabel} />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
