"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OngoingProject, ProjectStep } from "@prisma/client";
import MediaUploader from "@/components/admin/MediaUploader";

type ProjectWithSteps = OngoingProject & { steps: ProjectStep[] };

type StepState = {
  id: string;
  title: string;
  date: string;
  description: string;
  photos: string[];
  videoUrl: string;
  pendingPhotoUrl: string;
};

const categories = [
  { value: "Puits", label: "Puits" },
  { value: "Mini_forage", label: "Mini-forage" },
  { value: "Internats", label: "Internats" },
  { value: "Mosquees", label: "Mosquées" },
  { value: "Autres", label: "Autres" },
];

function parsePhotos(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    }
  } catch {
    // Ignore malformed JSON and keep an empty list.
  }
  return [];
}

function randomId() {
  return `step-${Math.random().toString(36).slice(2, 10)}`;
}

export default function EditProjectForm({ project }: { project: ProjectWithSteps }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    number: project.number?.toString() ?? "",
    title: project.title,
    category: project.category,
    location: project.location ?? "",
    region: project.region ?? "",
    lat: project.lat?.toString() ?? "",
    lng: project.lng?.toString() ?? "",
    startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : "",
    description: project.description ?? "",
    targetAmount: project.targetAmount?.toString() ?? "",
    currentAmount: project.currentAmount?.toString() ?? "",
    progress: project.progress,
    status: project.status,
    inaugurationVideoUrl: project.inaugurationVideoUrl ?? "",
    archiveToAchievements: project.archiveToAchievements,
  });

  const [steps, setSteps] = useState<StepState[]>(
    project.steps.map((step) => ({
      id: step.id,
      title: step.title ?? "",
      date: new Date(step.date).toISOString().slice(0, 10),
      description: step.description,
      photos: parsePhotos(step.photos),
      videoUrl: step.videoUrl ?? "",
      pendingPhotoUrl: "",
    }))
  );

  function updateStep(index: number, patch: Partial<StepState>) {
    setSteps((prev) => prev.map((step, i) => (i === index ? { ...step, ...patch } : step)));
  }

  function addStep() {
    setSteps((prev) => [
      ...prev,
      {
        id: randomId(),
        title: "",
        date: new Date().toISOString().slice(0, 10),
        description: "",
        photos: [],
        videoUrl: "",
        pendingPhotoUrl: "",
      },
    ]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      number: form.number.trim() ? Number(form.number) : null,
      lat: form.lat.trim() ? Number(form.lat) : null,
      lng: form.lng.trim() ? Number(form.lng) : null,
      targetAmount: form.targetAmount.trim() ? Number(form.targetAmount) : null,
      currentAmount: form.currentAmount.trim() ? Number(form.currentAmount) : null,
      startDate: form.startDate || null,
      steps: steps.map((step, index) => ({
        title: step.title,
        date: step.date || null,
        description: step.description,
        photos: step.photos,
        videoUrl: step.videoUrl,
        order: index,
      })),
    };

    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(data?.error ?? "Erreur pendant l'enregistrement.");
      return;
    }

    if (data?.archivedAchievementId) {
      setSuccess("Projet archivé automatiquement dans Réalisations.");
    } else {
      setSuccess("Projet mis à jour.");
    }
    router.refresh();
  }

  async function handleDeleteProject() {
    if (!window.confirm("Supprimer ce projet ? Cette action est irréversible.")) return;

    setDeleting(true);
    setError("");

    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
    });

    const data = await response.json();
    setDeleting(false);

    if (!response.ok) {
      setError(data?.error ?? "Impossible de supprimer le projet.");
      return;
    }

    router.push("/admin/travaux");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Numéro du projet</label>
          <input
            type="number"
            min={1}
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Titre</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Localisation (texte)</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Région</label>
          <input
            type="text"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={form.lat}
            onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={form.lng}
            onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Date de début</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Objectif financier (FCFA)</label>
          <input
            type="number"
            min={0}
            value={form.targetAmount}
            onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Montant actuel (FCFA)</label>
          <input
            type="number"
            min={0}
            value={form.currentAmount}
            onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Progression (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm((f) => ({ ...f, progress: Number(e.target.value) }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Statut</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          >
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark mb-1">Vidéo inauguration (URL)</label>
          <input
            type="url"
            value={form.inaugurationVideoUrl}
            onChange={(e) => setForm((f) => ({ ...f, inaugurationVideoUrl: e.target.value }))}
            className="w-full px-4 py-2 border border-primary/20 rounded-lg bg-white text-dark"
          />
        </div>
      </div>

      <MediaUploader
        folder="mission-misericorde/projects"
        resourceType="video"
        accept="video/*"
        label="Uploader la vidéo d'inauguration"
        onUploaded={(url) => setForm((f) => ({ ...f, inaugurationVideoUrl: url }))}
      />

      <label className="flex items-center gap-2 text-sm text-dark">
        <input
          type="checkbox"
          checked={form.archiveToAchievements}
          onChange={(e) => setForm((f) => ({ ...f, archiveToAchievements: e.target.checked }))}
          className="rounded border-primary/30"
        />
        Archiver automatiquement dans Réalisations quand le statut passe à &quot;Terminé&quot;
      </label>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark">Étapes du projet</h2>
          <button
            type="button"
            onClick={addStep}
            className="px-4 py-2 rounded-lg border border-primary/20 text-sm hover:bg-primary/5"
          >
            Ajouter une étape
          </button>
        </div>

        {steps.length === 0 && (
          <p className="text-sm text-dark/70 bg-white border border-primary/10 rounded-lg p-4">
            Aucune étape pour le moment. Ajoutez des étapes pour publier l&apos;historique des travaux.
          </p>
        )}

        {steps.map((step, index) => (
          <article key={step.id} className="bg-white border border-primary/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-dark">Étape {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="text-sm text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Titre étape</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-white text-dark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">Date</label>
                <input
                  type="date"
                  value={step.date}
                  onChange={(e) => updateStep(index, { date: e.target.value })}
                  className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-white text-dark"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Description</label>
              <textarea
                rows={3}
                value={step.description}
                onChange={(e) => updateStep(index, { description: e.target.value })}
                className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-white text-dark"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">Vidéo (URL)</label>
              <input
                type="url"
                value={step.videoUrl}
                onChange={(e) => updateStep(index, { videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-white text-dark"
              />
            </div>

            <MediaUploader
              folder="mission-misericorde/project-steps"
              resourceType="video"
              accept="video/*"
              label="Uploader une vidéo d'étape"
              onUploaded={(url) => updateStep(index, { videoUrl: url })}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-dark">Photos</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://..."
                  value={step.pendingPhotoUrl}
                  onChange={(e) => updateStep(index, { pendingPhotoUrl: e.target.value })}
                  className="flex-1 px-3 py-2 border border-primary/20 rounded-lg bg-white text-dark"
                />
                <button
                  type="button"
                  onClick={() => {
                    const candidate = step.pendingPhotoUrl.trim();
                    if (!candidate) return;
                    updateStep(index, {
                      photos: Array.from(new Set([...step.photos, candidate])),
                      pendingPhotoUrl: "",
                    });
                  }}
                  className="px-3 py-2 rounded-lg border border-primary/20 text-sm hover:bg-primary/5"
                >
                  Ajouter URL
                </button>
              </div>

              <MediaUploader
                folder="mission-misericorde/project-steps"
                resourceType="image"
                accept="image/*"
                label="Uploader une photo d'étape"
                onUploaded={(url) =>
                  updateStep(index, {
                    photos: Array.from(new Set([...step.photos, url])),
                  })
                }
              />

              <ul className="space-y-2">
                {step.photos.map((url, photoIndex) => (
                  <li
                    key={`${url}-${photoIndex}`}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded border border-primary/10 bg-cream text-sm"
                  >
                    <span className="truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateStep(index, {
                          photos: step.photos.filter((_, i) => i !== photoIndex),
                        })
                      }
                      className="text-red-600 hover:underline shrink-0"
                    >
                      Retirer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={handleDeleteProject}
          className="px-4 py-2 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60"
        >
          {deleting ? "Suppression..." : "Supprimer le projet"}
        </button>
      </div>
    </form>
  );
}
