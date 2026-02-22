/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";

export default function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  if (images.length === 0) return null;

  const src = images[currentIndex];
  const isPlaceholder = !src || (!src.startsWith("http") && !src.startsWith("/"));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 text-2xl text-white"
        onClick={onClose}
        aria-label="Fermer"
      >
        ×
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-3xl text-white"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/50 text-3xl text-white"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Suivant"
          >
            ›
          </button>
        </>
      )}
      <div
        className="max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {isPlaceholder ? (
          <div className="flex h-64 w-96 items-center justify-center rounded bg-dark/80 text-white">
            Photo (URL à configurer)
          </div>
        ) : (
          <img src={src} alt="" className="max-w-full max-h-[90vh] object-contain" />
        )}
      </div>
    </div>
  );
}
