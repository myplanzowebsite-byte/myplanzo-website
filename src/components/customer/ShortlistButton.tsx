"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ShortlistButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function add() {
    setLoading(true);
    try {
      const res = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={loading || done}
      className="rounded-md border border-mp-border bg-mp-card px-4 py-2 text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-panel disabled:opacity-60"
    >
      {done ? "Shortlisted" : loading ? "Saving…" : "Shortlist"}
    </button>
  );
}
