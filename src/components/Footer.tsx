import Link from "next/link";
import Image from "next/image";

export default function Footer({
  contactEmail,
  whatsappUrl,
  phoneLabel,
}: {
  contactEmail: string;
  whatsappUrl: string;
  phoneLabel: string;
}) {
  return (
    <footer className="mt-auto border-t border-primary/20 bg-dark text-cream">
      <div className="page-shell py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.png" alt="Mission Miséricorde" width={140} height={50} className="h-11 w-auto object-contain" />
              <span className="text-2xl font-bold text-white">Mission Miséricorde</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/80">
              Association à but non lucratif. Sadaqa jariya au Sénégal depuis le 24 avril 2025.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-cream/25 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
              Transparence, impact, régularité
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-lg font-bold text-accent">Navigation</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/nos-actions" className="text-cream/90 hover:text-accent">Nos actions</Link></li>
              <li><Link href="/realisations" className="text-cream/90 hover:text-accent">Réalisations</Link></li>
              <li><Link href="/travaux-en-cours" className="text-cream/90 hover:text-accent">Travaux en cours</Link></li>
              <li><Link href="/faire-un-don" className="text-cream/90 hover:text-accent">Faire un don</Link></li>
              <li><Link href="/contact" className="text-cream/90 hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-lg font-bold text-accent">Contact</h3>
            <p className="mt-3 text-sm text-cream/90">
              <a href={`mailto:${contactEmail}`} className="break-all hover:text-accent">
                {contactEmail}
              </a>
            </p>
            <p className="mt-2 text-sm text-cream/90">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                {phoneLabel}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/20 pt-6 text-center text-sm text-cream/70">
          © {new Date().getFullYear()} Mission Miséricorde. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
