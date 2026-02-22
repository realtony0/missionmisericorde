import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import EditAchievementForm from "./EditAchievementForm";

export default async function AdminEditAchievementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const achievement = await prisma.achievement.findUnique({ where: { id } });
  if (!achievement) notFound();

  return (
    <div>
      <Link href="/admin/realisations" className="text-primary text-sm hover:underline mb-4 inline-block">
        ← Retour aux réalisations
      </Link>
      <h1 className="text-2xl font-bold text-dark mb-6">Modifier : {achievement.name}</h1>
      <EditAchievementForm achievement={achievement} />
    </div>
  );
}
