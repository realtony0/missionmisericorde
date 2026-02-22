"use client";

import { useMemo, useState } from "react";

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  type: string;
  projectId: string | null;
  project: {
    id: string;
    number: number | null;
    title: string;
  } | null;
};

type Project = { id: string; number: number | null; title: string };

export default function DonationSection({
  campaigns,
  ongoingProjects,
}: {
  campaigns: Campaign[];
  ongoingProjects: Project[];
}) {
  const [mode, setMode] = useState<"cagnotte" | "libre">("cagnotte");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(ongoingProjects[0]?.id ?? "");

  const cagnottes = campaigns.filter((campaign) => campaign.type === "cagnotte");
  const selectedProject = useMemo(
    () => ongoingProjects.find((project) => project.id === selectedProjectId) ?? null,
    [ongoingProjects, selectedProjectId]
  );

  const progress = (campaign: Campaign) =>
    campaign.targetAmount > 0
      ? Math.min(100, (campaign.currentAmount / campaign.targetAmount) * 100)
      : 0;

  return (
    <div className="space-y-7">
      <div className="flex gap-2 rounded-xl border border-primary/20 bg-white p-1.5">
        <button
          type="button"
          onClick={() => setMode("cagnotte")}
          aria-pressed={mode === "cagnotte"}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            mode === "cagnotte" ? "bg-primary text-white" : "text-ink hover:bg-primary/5"
          }`}
        >
          Cagnottes ponctuelles
        </button>
        <button
          type="button"
          onClick={() => setMode("libre")}
          aria-pressed={mode === "libre"}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            mode === "libre" ? "bg-primary text-white" : "text-ink hover:bg-primary/5"
          }`}
        >
          Don libre permanent
        </button>
      </div>

      {mode === "cagnotte" && (
        <div className="space-y-5">
          {cagnottes.length === 0 ? (
            <div className="surface-card text-center text-sm text-ink/80">
              Aucune cagnotte active pour le moment. Vous pouvez faire un don libre.
            </div>
          ) : (
            cagnottes.map((campaign) => (
              <article
                key={campaign.id}
                className="overflow-hidden rounded-2xl border border-primary/20 bg-white"
              >
                <div className="border-b border-primary/10 bg-primary/5 px-5 py-4 sm:px-6">
                  <h3 className="text-xl font-bold text-dark">{campaign.title}</h3>
                </div>
                <div className="space-y-4 p-5 sm:p-6">
                  {campaign.description && (
                    <p className="text-sm text-ink/80">{campaign.description}</p>
                  )}
                  {campaign.project && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      Projet lié: {campaign.project.number ? `n°${campaign.project.number} - ` : ""}
                      {campaign.project.title}
                    </p>
                  )}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink/70">
                      <span>Progression financière</span>
                      <span>{Math.round(progress(campaign))}%</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-primary/10">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${progress(campaign)}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-ink">
                    {campaign.currentAmount.toLocaleString("fr-SN")} FCFA /{" "}
                    {campaign.targetAmount.toLocaleString("fr-SN")} FCFA
                  </p>
                </div>
              </article>
            ))
          )}

          <div className="surface-card-muted">
            <h3 className="text-lg font-bold text-dark">Comment faire un don pour une cagnotte</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm sm:text-base">
              <li>Choisissez la cagnotte que vous souhaitez soutenir.</li>
              <li>Choisissez un moyen de paiement dans la section ci-dessous.</li>
              <li>Envoyez simplement votre montant.</li>
            </ol>
          </div>
        </div>
      )}

      {mode === "libre" && (
        <div className="space-y-5">
          <div className="surface-card space-y-4">
            <p className="text-sm sm:text-base">
              Votre don libre est affecté selon les priorités de l&apos;association. Vous pouvez aussi
              indiquer un projet en cours.
            </p>

            {ongoingProjects.length > 0 ? (
              <div>
                <label className="mb-1 block text-sm font-semibold text-dark">
                  Projet à soutenir (optionnel)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full rounded-xl border border-primary/20 bg-white px-4 py-2.5 text-dark"
                >
                  <option value="">Affectation libre (aucun projet spécifique)</option>
                  {ongoingProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.number ? `Projet n°${project.number} - ` : ""}
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-sm text-ink/75">
                Aucun projet actif listé actuellement. Le don sera affecté aux besoins prioritaires.
              </p>
            )}

            {selectedProject && (
              <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-ink">
                Projet sélectionné: {selectedProject.number ? `n°${selectedProject.number} - ` : ""}
                {selectedProject.title}
              </p>
            )}
          </div>

          <div className="surface-card-muted">
            <h3 className="text-lg font-bold text-dark">Comment faire un don libre</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm sm:text-base">
              <li>Choisissez le mode &quot;Don libre permanent&quot;.</li>
              <li>Choisissez un moyen de paiement dans la section ci-dessous.</li>
              <li>Envoyez simplement le montant souhaité.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
