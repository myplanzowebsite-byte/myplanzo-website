"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelBookingButton({
  bookingId,
  isPaid,
}: {
  bookingId: string;
  isPaid: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (reason.trim().length < 4) {
      setError("Please give a brief reason.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not cancel the booking.");
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
        className="rounded-md border border-mp-border px-4 py-2 text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:text-mp-accent"
      >
        Cancel booking
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-md border border-mp-border bg-mp-panel p-4">
      <p className="text-sm font-medium text-mp-charcoal">Cancel this booking?</p>
      {isPaid && (
        <p className="text-xs text-mp-muted">
          Your payment will be refunded to the original method via Razorpay.
        </p>
      )}
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="Reason for cancelling"
        className="w-full rounded-md border border-mp-border bg-mp-card px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-mp-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Cancelling…" : "Confirm cancellation"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
        >
          Keep booking
        </button>
      </div>
    </form>
  );
}
