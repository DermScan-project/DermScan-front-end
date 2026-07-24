"use client";

import { useState } from "react";

export default function PhotoLightbox({ photos }: { photos: { id: string; url: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <button
            key={p.id}
            onClick={() => setActive(p.url)}
            className="aspect-square rounded-xl overflow-hidden border border-ardoise/10"
          >
            <img src={p.url} alt="Photo de la lésion" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
          onClick={() => setActive(null)}
        >
          <img src={active} alt="Photo de la lésion" className="max-w-full max-h-full rounded-lg" />
          <button
            onClick={() => setActive(null)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}