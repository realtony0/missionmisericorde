"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/nos-actions", label: "Nos actions" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/travaux-en-cours", label: "Travaux en cours" },
  { href: "/faire-un-don", label: "Faire un don" },
  { href: "/a-propos", label: "À propos" },
  { href: "/rejoindre", label: "Rejoindre nos groupes" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-primary/10 bg-white"
      aria-label="Navigation principale"
    >
      <div className="page-shell flex h-[72px] items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Logo Mission Miséricorde"
            width={120}
            height={44}
            className="h-10 w-auto shrink-0 transition group-hover:scale-[1.02]"
            priority
          />
          <span className="hidden leading-tight sm:block">
            <span className="block text-xl font-bold text-dark">Mission</span>
            <span className="block text-xl font-bold text-dark -mt-1">Miséricorde</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                isActive(l.href)
                  ? "bg-primary/10 text-primary"
                  : "text-dark/80 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <Link
            href="/faire-un-don"
            className="btn-primary px-5 text-base"
          >
            Faire un don
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-[46px] min-w-[46px] items-center justify-center rounded-lg border border-primary/25 bg-white/80 text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-primary/10 bg-white px-4 pb-4 pt-3 lg:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-2xl border border-primary/20 bg-white p-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  isActive(l.href) ? "bg-primary/10 text-primary" : "text-dark hover:bg-primary/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/faire-un-don"
              className="btn-primary mt-1 text-base"
            >
              Faire un don
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
