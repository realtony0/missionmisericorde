import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-cream">
      {session ? (
        <>
          <header className="bg-dark text-cream py-3 px-4">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <Link href="/admin" className="font-bold">
                Admin Mission Miséricorde
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm text-cream/80 hover:text-accent">
                  Voir le site
                </Link>
                <span className="text-sm text-cream/70">{session.user?.email}</span>
                <Link href="/api/auth/signout" className="text-sm text-accent hover:underline">
                  Déconnexion
                </Link>
              </div>
            </div>
          </header>
          <nav className="bg-white border-b border-primary/10 px-4 py-2">
            <div className="max-w-5xl mx-auto flex gap-4 text-sm">
              <Link href="/admin" className="text-dark hover:text-primary">
                Dashboard
              </Link>
              <Link href="/admin/realisations" className="text-dark hover:text-primary">
                Réalisations
              </Link>
              <Link href="/admin/travaux" className="text-dark hover:text-primary">
                Travaux en cours
              </Link>
              <Link href="/admin/dons" className="text-dark hover:text-primary">
                Dons / Cagnottes
              </Link>
              <Link href="/admin/parametres" className="text-dark hover:text-primary">
                Paramètres
              </Link>
            </div>
          </nav>
          <div className="max-w-5xl mx-auto p-4">{children}</div>
        </>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
