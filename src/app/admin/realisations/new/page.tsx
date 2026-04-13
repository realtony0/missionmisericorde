import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import NewAchievementForm from "./NewAchievementForm";

export default async function AdminNewAchievementPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const highest = await prisma.achievement.findFirst({
    orderBy: { number: "desc" },
    select: { number: true },
  });
  const suggestedNumber = (highest?.number ?? 0) + 1;

  return (
    <div>
      <Link href="/admin/realisations" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux réalisations
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">Nouvelle réalisation</h1>
      <NewAchievementForm suggestedNumber={suggestedNumber} />
    </div>
  );
}
