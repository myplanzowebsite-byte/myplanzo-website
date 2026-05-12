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

function WaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
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
            {/* WhatsApp — always public */}
            {v.waPhone && (
              <a
                href={`https://wa.me/${v.waPhone}?text=Hi%20MyPlanzo!`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:border-green-400 hover:bg-green-50"
                style={{ borderColor: "var(--color-mp-border)", background: "var(--color-mp-panel)", color: "#22c55e" }}
                onClick={(e) => e.stopPropagation()}
              >
                <WaIcon size={14} />
              </a>
            )}

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
