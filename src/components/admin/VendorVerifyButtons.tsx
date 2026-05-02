"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VendorVerificationStatus } from "@prisma/client";

export function VendorVerifyButtons({
  vendorUserId,
  status,
}: {
  vendorUserId: string;
  status: VendorVerificationStatus;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function setStatus(next: VendorVerificationStatus) {
    setLoading(next);
    try {
      const res = await fetch(`/api/admin/vendors/${vendorUserId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) router.refresh();
    } finally {
      setLoading(null);
    }
  }

  if (status === "ACTIVE") {
    return <p className="rounded-md border border-mp-border bg-mp-soft-blue px-2 py-1 text-xs text-mp-accent">Approved</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => setStatus("ACTIVE")}
        className="rounded-lg bg-mp-charcoal py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-50"
      >
        {loading === "ACTIVE" ? "Saving…" : "Approve vendor"}
      </button>
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => setStatus("REJECTED")}
        className="rounded-lg border border-mp-border bg-mp-card py-2 text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-panel disabled:opacity-50"
      >
        {loading === "REJECTED" ? "Saving…" : "Reject"}
      </button>
    </div>
  );
}
