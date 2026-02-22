import type { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Travaux en cours | Mission Miséricorde",
  description: "Suivi dynamique des projets de Mission Miséricorde.",
};
export const dynamic = "force-dynamic";

function parsePhotos(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Ignore malformed JSON payloads.
  }
  return [];
}

export default async function TravauxEnCoursPage() {
  const projects = await prisma.ongoingProject.findMany({
    where: { archivedAt: null },
    include: { steps: { orderBy: { order: "asc" } } },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  const ongoing = projects.filter((project) => project.status === "En cours");
  const finished = projects.filter((project) => project.status === "Terminé");

  return (
    <div className="page-shell py-8 sm:py-12">
      <section className="page-hero">
        <span className="eyebrow">Suivi dynamique</span>
        <h1 className="page-title mt-4">Travaux en cours</h1>
        <p className="page-subtitle max-w-4xl">
          Suivez les projets étape par étape: localisation, historique des mises à jour, photos, vidéos, progression globale et état de finalisation.
        </p>
      </section>

      <section className="mt-10 sm:mt-12">
        {projects.length === 0 ? (
          <div className="surface-card text-center text-ink/80">
            Aucun projet en cours pour le moment.
          </div>
        ) : (
          <div className="space-y-10 sm:space-y-12">
            <section className="space-y-6">
              <h2 className="section-title text-2xl">Projets actifs</h2>
              {ongoing.length === 0 ? (
                <p className="surface-card text-sm text-ink/80">Aucun projet actif pour le moment.</p>
              ) : (
                ongoing.map((project) => (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-primary/20 bg-white"
                  >
                    <div className="border-b border-primary/10 p-5 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                          {project.status}
                        </span>
                        {project.category && (
                          <span className="rounded-full border border-primary/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-ink">
                            {project.category}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-2xl font-bold">
                        {project.number ? `Projet n°${project.number} - ` : ""}
                        {project.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/80">
                        <span>Catégorie: {project.category}</span>
                        {project.location && <span>Localisation: {project.location}</span>}
                        {project.startDate && (
                          <span>
                            Début: {new Date(project.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        )}
                      </div>
                      {project.description && <p className="mt-3 text-sm">{project.description}</p>}

                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/70">
                          <span>Progression projet</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {typeof project.targetAmount === "number" && (
                        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3">
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/80">
                            Objectif financier
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-accent/25">
                            <div
                              className="h-full bg-accent"
                              style={{
                                width: `${Math.min(
                                  100,
                                  project.targetAmount > 0
                                    ? ((project.currentAmount ?? 0) / project.targetAmount) * 100
                                    : 0
                                )}%`,
                              }}
                            />
                          </div>
                          <div className="mt-1 text-xs text-ink/75">
                            {(project.currentAmount ?? 0).toLocaleString("fr-SN")} FCFA /{" "}
                            {project.targetAmount.toLocaleString("fr-SN")} FCFA
                          </div>
                        </div>
                      )}

                      {project.inaugurationVideoUrl && (
                        <div className="mt-4">
                          <a
                            href={project.inaugurationVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-lg bg-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-wide text-primary hover:bg-primary/20"
                          >
                            Voir la vidéo d&apos;inauguration
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-5 pt-4 sm:p-6 sm:pt-5">
                      <h4 className="text-lg font-bold">Historique des mises à jour</h4>
                      {project.steps.length === 0 ? (
                        <p className="mt-3 text-sm text-ink/80">Aucune étape publiée pour le moment.</p>
                      ) : (
                        <ul className="mt-4 space-y-4">
                          {project.steps.map((step) => {
                            const photos = parsePhotos(step.photos);
                            return (
                              <li
                                key={step.id}
                                className="surface-card-muted border-l-4 border-primary/25 p-4"
                              >
                                <p className="text-xs font-semibold uppercase tracking-wide text-ink/70">
                                  {new Date(step.date).toLocaleDateString("fr-FR")}
                                </p>
                                {step.title && (
                                  <p className="mt-1 text-base font-bold text-dark">{step.title}</p>
                                )}
                                <p className="mt-1 text-sm text-ink/80">{step.description}</p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                  {photos.length > 0 && (
                                    <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                                      {photos.length} photo(s)
                                    </span>
                                  )}
                                  {step.videoUrl && (
                                    <a
                                      href={step.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="rounded-full border border-primary/25 px-2.5 py-1 font-semibold text-primary hover:bg-primary/10"
                                    >
                                      Voir la vidéo de l&apos;étape
                                    </a>
                                  )}
                                </div>
                                {photos.length > 0 && (
                                  <ul className="mt-3 space-y-1 text-xs text-ink/70">
                                    {photos.map((photo, index) => (
                                      <li key={`${step.id}-${index}`}>
                                        <a
                                          href={photo}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="hover:text-primary hover:underline"
                                        >
                                          Photo {index + 1}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </article>
                ))
              )}
            </section>

            {finished.length > 0 && (
              <section className="space-y-4">
                <h2 className="section-title text-2xl">Projets terminés</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {finished.map((project) => (
                    <div
                      key={project.id}
                      className="surface-card text-sm text-ink/80"
                    >
                      {project.number ? `Projet n°${project.number} - ` : ""}
                      {project.title}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
