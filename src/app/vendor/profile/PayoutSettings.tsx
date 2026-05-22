"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

type Initial = {
  payoutUpiId: string;
  payoutRazorpayLink: string;
};

export function PayoutSettings({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const hasDetails = Boolean(initial.payoutUpiId || initial.payoutRazorpayLink);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payoutUpiId: form.payoutUpiId.trim() || null,
          payoutRazorpayLink: form.payoutRazorpayLink.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || "Could not save payout details." });
        return;
      }
      setMsg({ kind: "ok", text: "Payout details saved." });
      setEditing(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-mp-charcoal">Payout details</h2>
          <p className="text-xs text-mp-muted">
            Where MyPlanzo sends your net earnings. Add a UPI ID, a Razorpay link, or both.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:border-mp-accent hover:bg-mp-warm"
          >
            {hasDetails ? "Edit" : "Add details"}
          </button>
        )}
      </div>

      {msg && (
        <p
          className={`rounded-md border px-3 py-2 text-xs ${
            msg.kind === "ok"
              ? "border-green-500/20 bg-green-500/10 text-green-700"
              : "border-mp-accent/20 bg-mp-accent-soft text-mp-accent"
          }`}
        >
          {msg.text}
        </p>
      )}

      {!editing ? (
        hasDetails ? (
          <dl className="space-y-2 text-sm">
            {initial.payoutUpiId && (
              <div className="flex justify-between gap-3">
                <dt className="text-mp-muted">UPI ID</dt>
                <dd className="font-medium text-mp-charcoal">{initial.payoutUpiId}</dd>
              </div>
            )}
            {initial.payoutRazorpayLink && (
              <div className="flex justify-between gap-3">
                <dt className="text-mp-muted">Razorpay link</dt>
                <dd className="truncate font-medium text-mp-charcoal">
                  <a
                    href={initial.payoutRazorpayLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {initial.payoutRazorpayLink}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-xs text-mp-muted">
            No payout details yet — add a UPI ID or Razorpay link so we can pay you.
          </p>
        )
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-mp-muted">UPI ID</span>
            <input
              value={form.payoutUpiId}
              onChange={(e) => set("payoutUpiId", e.target.value)}
              placeholder="name@oksbi"
              autoComplete="off"
              className={FIELD}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-mp-muted">Razorpay link</span>
            <input
              type="url"
              value={form.payoutRazorpayLink}
              onChange={(e) => set("payoutRazorpayLink", e.target.value)}
              placeholder="https://rzp.io/l/your-link"
              autoComplete="off"
              className={FIELD}
            />
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
            >
              {busy ? "Saving…" : "Save payout details"}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(initial);
                setMsg(null);
                setEditing(false);
              }}
              className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
