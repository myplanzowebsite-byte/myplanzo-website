"use client";

import { useState } from "react";

export function ReplayTourButton() {
  const [done, setDone] = useState(false);

  function replay() {
    try {
      localStorage.removeItem("mp_tour_customer");
      localStorage.removeItem("mp_tour_vendor");
    } catch {
      /* ignore */
    }
    setDone(true);
  }

  return (
    <div className="space-y-1">
      <button
        onClick={replay}
        className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal transition-colors hover:border-mp-accent"
      >
        Replay walkthrough
      </button>
      {done && (
        <p className="text-xs text-mp-muted">
          Done — the walkthrough will show next time you open your dashboard.
        </p>
      )}
    </div>
  );
}
