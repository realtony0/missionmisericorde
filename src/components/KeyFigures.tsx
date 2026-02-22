import { prisma } from "@/lib/db";
import KeyFiguresClient from "./KeyFiguresClient";

export default async function KeyFigures() {
  const [puitsCount, miniForageCount, latestOngoing, internatsCount] = await Promise.all([
    prisma.achievement.count({ where: { category: "Puits" } }),
    prisma.achievement.count({ where: { category: "Mini_forage" } }),
    prisma.ongoingProject.findFirst({
      where: { status: "En cours" },
      orderBy: [{ number: "desc" }, { updatedAt: "desc" }],
      select: { number: true },
    }),
    prisma.achievement.count({ where: { category: "Internats" } }),
  ]);

  const stats = [
    { value: puitsCount, label: "Puits construits" },
    { value: miniForageCount, label: "Mini-forages" },
    {
      value: latestOngoing?.number ?? 0,
      label: latestOngoing?.number ? `Projet n°${latestOngoing.number} en cours` : "Projet en cours",
    },
    { value: internatsCount, label: "Actions internat coranique" },
  ];

  return <KeyFiguresClient stats={stats} />;
}
