"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ListingStatus } from "@prisma/client";

export function ListingModerateButtons({
  listingId,
  status,
}: {
  listingId: string;
  status: ListingStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function setStatus(next: "ACTIVE" | "ARCHIVED") {
    setLoading(next);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={loading !== null || status === "ACTIVE"}
        onClick={() => setStatus("ACTIVE")}
        className="rounded-md bg-mp-charcoal px-3 py-1.5 text-xs font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-40"
      >
        {loading === "ACTIVE" ? "Saving…" : "Approve"}
      </button>
      <button
        type="button"
        disabled={loading !== null || status === "ARCHIVED"}
        onClick={() => setStatus("ARCHIVED")}
        className="rounded-md border border-mp-border bg-mp-card px-3 py-1.5 text-xs font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-panel disabled:opacity-40"
      >
        {loading === "ARCHIVED" ? "Saving…" : "Reject"}
      </button>
    </div>
  );
}
