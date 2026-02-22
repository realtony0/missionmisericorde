"use client";

import { useState } from "react";

type MediaUploaderProps = {
  folder: string;
  resourceType?: "image" | "video" | "raw";
  accept?: string;
  onUploaded: (url: string) => void;
  label?: string;
};

export default function MediaUploader({
  folder,
  resourceType = "image",
  accept,
  onUploaded,
  label = "Téléverser un fichier",
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("resourceType", resourceType);

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Upload impossible.");
        return;
      }

      if (typeof data.url === "string" && data.url.length > 0) {
        onUploaded(data.url);
      } else {
        setError("Aucune URL renvoyée par le serveur.");
      }
    } catch {
      setError("Erreur réseau pendant le téléversement.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/20 bg-white text-sm text-dark cursor-pointer hover:bg-primary/5">
        <span>{uploading ? "Téléversement..." : label}</span>
        <input
          type="file"
          onChange={onFileChange}
          accept={accept}
          className="hidden"
          disabled={uploading}
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
