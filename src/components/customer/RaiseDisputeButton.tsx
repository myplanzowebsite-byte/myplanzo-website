"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RaiseDisputeButton({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (reason.trim().length < 8) {
      setError("Please describe the issue (at least 8 characters).");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/dispute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not raise the dispute.");
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-mp-muted underline hover:text-mp-accent"
      >
        Report an issue
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-md border border-mp-border bg-mp-panel p-4">
      <p className="text-sm font-medium text-mp-charcoal">Report an issue</p>
      <p className="text-xs text-mp-muted">The MyPlanzo team will review and get back to you.</p>
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="What went wrong?"
        className="w-full rounded-md border border-mp-border bg-mp-card px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Submit dispute"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
