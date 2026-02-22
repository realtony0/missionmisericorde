"use client";

import { AnimatedNumber } from "./AnimatedNumber";

export default function KeyFiguresClient({
  stats,
}: {
  stats: { value: number; label: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="surface-card text-center"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
            Indicateur
          </p>
          <div className="mt-2 text-4xl font-bold text-primary md:text-5xl">
            <AnimatedNumber value={item.value} />
          </div>
          <div className="mt-2 text-sm font-semibold text-ink">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
