"use client";

import { useState } from "react";

/**
 * Scrollable image gallery for listings. Vendors upload up to 10 photos, so
 * this lets customers page through all of them with arrows + dots. With a
 * single photo it renders just the image (no controls); with none it renders
 * the optional `fallback` (or nothing).
 */
export function ImageCarousel({
  photos,
  alt,
  heightClass = "h-64",
  fallback,
  showCounter = true,
}: {
  photos: string[];
  alt: string;
  /** Tailwind height class for the frame, e.g. "h-64" or "h-[170px]". */
  heightClass?: string;
  /** Rendered when there are no photos (e.g. an emoji placeholder). */
  fallback?: React.ReactNode;
  showCounter?: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const count = photos.length;

  if (count === 0) return fallback ? <>{fallback}</> : null;

  const safeIdx = Math.min(idx, count - 1);

  function step(e: React.MouseEvent, dir: number) {
    // Carousels can sit inside clickable cards — never let arrow/dot clicks
    // bubble up into a navigation or trigger a link.
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (((i + dir) % count) + count) % count);
  }

  return (
    <div className={`group/carousel relative w-full overflow-hidden ${heightClass}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photos[safeIdx]}
        alt={count > 1 ? `${alt} — photo ${safeIdx + 1} of ${count}` : alt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => step(e, -1)}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/65 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => step(e, 1)}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/65 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === safeIdx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === safeIdx ? "w-4 bg-white" : "w-1.5 bg-white/55 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {showCounter && (
            <div className="absolute right-2 top-2 z-10 rounded-md bg-black/52 px-1.5 py-0.5 text-[0.65rem] font-medium text-white">
              {safeIdx + 1}/{count}
            </div>
          )}
        </>
      )}
    </div>
  );
}
