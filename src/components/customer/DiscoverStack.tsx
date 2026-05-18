"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export type DiscoverCard = {
  id: string;
  name: string;
  subtitle: string;
  img: string | null;
  price: string;
  href: string;
};

const SWIPE_THRESHOLD = 90;

export function DiscoverStack({ cards }: { cards: DiscoverCard[] }) {
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [shortlisted, setShortlisted] = useState(0);
  const dragStart = useRef<number | null>(null);

  const current = cards[index];
  const next = cards[index + 1];

  function advance() {
    setDx(0);
    setIndex((i) => i + 1);
  }

  function pass() {
    advance();
  }

  function shortlist() {
    if (current) {
      // mock listings aren't in the DB — the failed call is harmless.
      void fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: current.id }),
      }).catch(() => {});
      setShortlisted((n) => n + 1);
    }
    advance();
  }

  // Keyboard: ← pass, → shortlist.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") pass();
      if (e.key === "ArrowRight") shortlist();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function onPointerDown(e: React.PointerEvent) {
    dragStart.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragStart.current === null) return;
    setDx(e.clientX - dragStart.current);
  }
  function onPointerUp() {
    if (dragStart.current === null) return;
    dragStart.current = null;
    if (dx > SWIPE_THRESHOLD) shortlist();
    else if (dx < -SWIPE_THRESHOLD) pass();
    else setDx(0);
  }

  if (!current) {
    return (
      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-10 text-center shadow-[var(--shadow-mp-card)]">
        <p className="text-mp-charcoal font-medium">That&apos;s everyone for now.</p>
        <p className="mt-1 text-sm text-mp-muted">
          You shortlisted {shortlisted} vendor{shortlisted === 1 ? "" : "s"}.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/customer/shortlist" className="text-sm text-mp-accent underline">
            View shortlist
          </Link>
          <Link href="/browse" className="text-sm text-mp-accent underline">
            Browse grid
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-[420px] max-w-sm select-none">
        {next && (
          <div className="absolute inset-0 scale-95 rounded-[var(--radius-mp-card)] bg-mp-card opacity-60 shadow-[var(--shadow-mp-card)]" />
        )}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: `translateX(${dx}px) rotate(${dx / 22}deg)`,
            transition: dragStart.current === null ? "transform 0.2s" : "none",
          }}
          className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)] active:cursor-grabbing"
        >
          {current.img ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={current.img} alt={current.name} className="h-60 w-full object-cover" />
          ) : (
            <div className="flex h-60 w-full items-center justify-center bg-mp-warm text-mp-muted">
              No photo
            </div>
          )}
          <div className="space-y-1 p-4">
            <p className="text-xs uppercase tracking-wide text-mp-steel">{current.subtitle}</p>
            <h2 className="text-lg font-semibold text-mp-charcoal">{current.name}</h2>
            <p className="text-sm text-mp-muted">{current.price}</p>
            <Link href={current.href} className="text-sm text-mp-accent underline">
              View full profile →
            </Link>
          </div>

          {/* Drag hints */}
          {dx > 30 && (
            <span className="absolute right-4 top-4 rounded-md border-2 border-green-500 px-2 py-1 text-sm font-bold text-green-600">
              SHORTLIST
            </span>
          )}
          {dx < -30 && (
            <span className="absolute left-4 top-4 rounded-md border-2 border-mp-accent px-2 py-1 text-sm font-bold text-mp-accent">
              PASS
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={pass}
          className="h-12 w-12 rounded-full border border-mp-border bg-mp-card text-lg text-mp-charcoal transition hover:border-mp-accent"
          aria-label="Pass"
        >
          ✕
        </button>
        <button
          onClick={shortlist}
          className="h-12 w-12 rounded-full bg-mp-charcoal text-lg text-mp-panel transition hover:bg-mp-accent"
          aria-label="Shortlist"
        >
          ♥
        </button>
      </div>
      <p className="text-center text-xs text-mp-muted">
        Swipe or use ← / → · {cards.length - index} left
      </p>
    </div>
  );
}
