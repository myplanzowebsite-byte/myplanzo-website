"use client";

import { useState } from "react";
import Script from "next/script";

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void; on: (event: string, cb: (resp: unknown) => void) => void };

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (resp: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export function CheckoutClient({
  bookingId,
  kind = "advance",
  label,
}: {
  bookingId: string;
  kind?: "advance" | "balance";
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const buttonLabel = label ?? (kind === "balance" ? "Pay balance" : "Pay 50% advance");

  async function pay() {
    setError(null);
    setBusy(true);
    try {
      if (!scriptReady || !window.Razorpay) {
        setError("Payment is still loading — please try again in a moment.");
        return;
      }

      // Step 1 — create the order on our backend.
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, kind }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.orderId || !data.keyId) {
        setError(data.error || "Could not start payment.");
        return;
      }

      // Step 2 — open the Razorpay modal with the order id.
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "MyPlanzo",
        description: data.description,
        order_id: data.orderId,
        prefill: data.prefill,
        theme: { color: "#0f0f0f" },
        handler: async (resp: RazorpaySuccess) => {
          // Step 3 — verify the signature server-side before trusting success.
          try {
            const vr = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const vd = await vr.json().catch(() => ({}));
            if (!vr.ok || !vd.ok) {
              setError(vd.error || "We couldn't confirm your payment. If you were charged, it will reflect shortly.");
              setBusy(false);
              return;
            }
            // Land back on checkout with ?paid=1 so the Purchase pixel fires
            // and the success state renders.
            window.location.href = `/customer/checkout/${bookingId}?paid=1`;
          } catch {
            setError("We couldn't confirm your payment. If you were charged, it will reflect shortly.");
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the modal without paying.
            setBusy(false);
          },
        },
      });

      rzp.on("payment.failed", (resp: unknown) => {
        const description =
          (resp as { error?: { description?: string } })?.error?.description ?? "Payment failed. Please try again.";
        setError(description);
        setBusy(false);
      });

      rzp.open();
    } catch {
      setError("Could not start payment.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onLoad={() => setScriptReady(true)}
      />
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
        {busy ? "Processing…" : buttonLabel}
      </button>
    </div>
  );
}
