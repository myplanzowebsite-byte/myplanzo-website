"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none focus:border-mp-accent";

export function DisputeResolveForm({ disputeId }: { disputeId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"RESOLVED" | "REJECTED">("RESOLVED");
  const [resolution, setResolution] = useState("");
  const [override, setOverride] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (resolution.trim().length < 4) {
      setError("Add a resolution note.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/disputes/${disputeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          resolution: resolution.trim(),
          overrideBookingStatus: override || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not resolve.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-3 space-y-2 border-t border-mp-border pt-3">
      {error && <p className="text-xs text-mp-accent">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "RESOLVED" | "REJECTED")}
          className={`${FIELD} max-w-[160px]`}
        >
          <option value="RESOLVED">Resolve</option>
          <option value="REJECTED">Reject</option>
        </select>
        <select
          value={override}
          onChange={(e) => setOverride(e.target.value)}
          className={`${FIELD} max-w-[200px]`}
        >
          <option value="">Booking: no change</option>
          <option value="CONFIRMED">Override → Confirmed</option>
          <option value="CANCELLED">Override → Cancelled</option>
          <option value="COMPLETED">Override → Completed</option>
        </select>
      </div>
      <textarea
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        rows={2}
        placeholder="Resolution note (sent to the customer)"
        className={FIELD}
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {busy ? "Saving…" : "Submit decision"}
      </button>
    </form>
  );
}
