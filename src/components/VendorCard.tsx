"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export interface VendorCardData {
  id: string | number;
  name: string;
  category: string;
  meta?: string;
  rating?: number;
  countLabel?: string;          // e.g. "142 events"
  price: string;                // e.g. "₹8,000"
  unit?: string;                // e.g. "starting" or "/ plate"
  img?: string;
  emoji?: string;               // fallback when no img
  waPhone?: string;             // digits only, e.g. "919999999999"
  href: string;                 // card/book destination
  verified?: boolean;
  /** Label on the action button. Defaults to "View →" */
  buttonLabel?: string;
}

export function VendorCard({ v }: { v: VendorCardData }) {
  const router = useRouter();

  function handleBook(e: React.MouseEvent) {
    e.preventDefault();
    router.push(v.href);
  }

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:border-[#383838] hover:shadow-[0_14px_44px_rgba(0,0,0,0.45)]"
      style={{ background: "var(--color-mp-panel)", borderColor: "var(--color-mp-border)" }}
    >
      {/* Image / emoji fallback */}
      <div className="relative h-[170px] overflow-hidden" style={{ background: "var(--color-mp-taupe)" }}>
        {v.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={v.img} alt={v.name} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl">{v.emoji ?? "🎉"}</div>
        )}

        {/* Category tag */}
        <div
          className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.04em] text-white backdrop-blur-md"
          style={{ background: "rgba(0,0,0,0.52)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          {v.category}
        </div>

        {/* Verified badge */}
        {v.verified !== false && (
          <div
            className="absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[0.62rem] font-bold text-white"
            style={{ background: "var(--color-mp-green)" }}
          >
            ✓ Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 pb-3">
        <Link href={v.href} className="mb-1 block text-[0.9rem] font-bold tracking-[-0.01em] hover:underline" style={{ color: "var(--color-mp-charcoal)" }}>
          {v.name}
        </Link>

        {v.meta && (
          <div className="mb-2.5 text-[0.72rem]" style={{ color: "var(--color-mp-text3)" }}>
            {v.meta}
          </div>
        )}

        <div className="mb-3 flex min-h-[18px] gap-2.5">
          {v.rating ? (
            <>
              <div className="flex items-center gap-0.5 text-[0.75rem]" style={{ color: "var(--color-mp-muted)" }}>
                <span style={{ color: "var(--color-mp-gold)" }}>★</span> {v.rating}
              </div>
              {v.countLabel && (
                <div className="text-[0.75rem]" style={{ color: "var(--color-mp-muted)" }}>{v.countLabel}</div>
              )}
            </>
          ) : (
            <div className="text-[0.75rem] italic" style={{ color: "var(--color-mp-text3)" }}>
              No reviews yet
            </div>
          )}
        </div>

        {/* Footer row */}
        <div
          className="flex items-center justify-between border-t pt-2.5"
          style={{ borderColor: "var(--color-mp-border)" }}
        >
          <div className="text-[0.9rem] font-bold" style={{ color: "var(--color-mp-charcoal)" }}>
            {v.price}
            {v.unit && (
              <small className="ml-1 text-[0.65rem] font-normal" style={{ color: "var(--color-mp-text3)" }}>
                {v.unit}
              </small>
            )}
          </div>

          <div className="flex gap-1.5">
            {/* Book / View */}
            <button
              onClick={handleBook}
              className="rounded-lg px-3.5 py-1.5 text-[0.75rem] font-semibold text-white transition-opacity hover:opacity-87"
              style={{ background: "var(--color-mp-steel)", fontFamily: "inherit", border: "none", cursor: "pointer" }}
            >
              {v.buttonLabel ?? "View →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
