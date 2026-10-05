// src/app/projects/[id]/tipe/[unitId]/UnitGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export interface GalleryPhoto {
  url: string;
  label?: string;
}

export default function UnitGallery({ photos, unitName }: { photos: GalleryPhoto[]; unitName: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] bg-slate-100">
        <Image src="/images/placeholder.svg" alt={unitName} fill className="object-cover" />
      </div>
    );
  }

  const current = photos[Math.min(active, photos.length - 1)];

  return (
    <div className="space-y-3">
      {/* Foto utama */}
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-[2rem] bg-slate-900"
      >
        <Image
          key={current.url}
          src={current.url}
          alt={current.label ? `${unitName} - ${current.label}` : unitName}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        {current.label && (
          <span className="absolute bottom-4 left-4 rounded-xl border border-white/15 bg-slate-950/65 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {current.label}
          </span>
        )}
        <span className="absolute bottom-4 right-4 rounded-xl bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
          {active + 1} / {photos.length} • Klik untuk perbesar
        </span>
      </button>

      {/* Thumbnail */}
      {photos.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((p, i) => (
            <button
              key={`${p.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                i === active ? "border-orange-500 shadow-lg shadow-orange-500/20" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={p.url} alt={p.label || `${unitName} ${i + 1}`} fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Label chips */}
      {photos.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => (
            <button
              key={`${p.url}-chip-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                i === active
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200"
              }`}
            >
              {p.label || `Foto ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20"
          >
            ✕ Tutup
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a - 1 + photos.length) % photos.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20 sm:left-6"
          >
            ‹
          </button>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[active].url}
              alt={photos[active].label || unitName}
              fill
              sizes="100vw"
              className="object-contain"
            />
            {photos[active].label && (
              <p className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                {photos[active].label} • {active + 1}/{photos.length}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setActive((a) => (a + 1) % photos.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-4 py-3 text-lg font-bold text-white backdrop-blur-md hover:bg-white/20 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
