"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Quote = {
  id: string;
  amountPaise: number;
  note: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
};

const inr = new Intl.NumberFormat("en-IN");
const STATUS_STYLE: Record<Quote["status"], string> = {
  PENDING: "bg-mp-warm text-mp-charcoal",
  ACCEPTED: "bg-green-500/15 text-green-700",
  DECLINED: "bg-mp-accent-soft text-mp-accent",
};

export function QuotePanel({
  bookingId,
  role,
  bookingStatus,
}: {
  bookingId: string;
  role: "CUSTOMER" | "VENDOR";
  bookingStatus: string;
}) {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/bookings/${bookingId}/quotes`);
    const data = await res.json().catch(() => ({}));
    if (res.ok) setQuotes(data.quotes ?? []);
  }, [bookingId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function sendQuote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const rupees = Number(amount);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaise: Math.round(rupees * 100), note: note || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not send quote.");
        return;
      }
      setAmount("");
      setNote("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function respond(quoteId: string, action: "accept" | "decline") {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not update quote.");
        return;
      }
      if (data.checkoutUrl) {
        router.push(data.checkoutUrl);
        return;
      }
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-4">
      <h2 className="text-sm font-semibold text-mp-charcoal">Quotes</h2>

      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}

      {quotes.length === 0 && (
        <p className="text-xs text-mp-muted">
          {role === "VENDOR"
            ? "No quotes sent yet. Send the customer a price below."
            : "The vendor hasn't sent a quote yet."}
        </p>
      )}

      <div className="space-y-3">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-md border border-mp-border bg-mp-panel p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-semibold text-mp-charcoal">
                ₹{inr.format(q.amountPaise / 100)}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLE[q.status]}`}
              >
                {q.status}
              </span>
            </div>
            {q.note && <p className="mt-1 text-sm text-mp-muted">{q.note}</p>}
            {role === "CUSTOMER" && q.status === "PENDING" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => respond(q.id, "accept")}
                  disabled={busy}
                  className="rounded-md bg-mp-charcoal px-3 py-1.5 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
                >
                  Accept &amp; pay
                </button>
                <button
                  onClick={() => respond(q.id, "decline")}
                  disabled={busy}
                  className="rounded-md border border-mp-border px-3 py-1.5 text-sm font-medium text-mp-charcoal transition-colors hover:bg-mp-warm disabled:opacity-60"
                >
                  Decline
                </button>
              </div>
            )}
            {role === "CUSTOMER" && q.status === "ACCEPTED" && (
              <button
                onClick={() => router.push(`/customer/checkout/${bookingId}`)}
                className="mt-3 text-sm font-medium text-mp-accent underline"
              >
                Go to checkout →
              </button>
            )}
          </div>
        ))}
      </div>

      {role === "VENDOR" && (
        bookingStatus === "PENDING" ? (
          <form onSubmit={sendQuote} className="space-y-2 border-t border-mp-border pt-4">
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount ₹"
                className="w-32 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's included (optional)"
                className="flex-1 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send quote"}
            </button>
          </form>
        ) : (
          <p className="border-t border-mp-border pt-4 text-xs text-mp-muted">
            New quotes can only be sent while the booking is pending.
          </p>
        )
      )}
    </div>
  );
}
