"use client";

import { useState } from "react";

export function CheckoutClient({ bookingId }: { bookingId: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Could not start payment.");
        return;
      }
      // Redirect to the hosted Razorpay payment link. Razorpay returns the
      // customer to /api/payments/callback once payment completes.
      window.location.href = data.url;
    } catch {
      setError("Could not start payment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}
      <button
        onClick={pay}
        disabled={busy}
        className="rounded-md bg-mp-charcoal px-5 py-2.5 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {busy ? "Starting payment…" : "Pay with Razorpay"}
      </button>
    </div>
  );
}
