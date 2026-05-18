"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Prefs = { bookingUpdates: boolean; quotes: boolean; messages: boolean };

const ROWS: { key: keyof Prefs; label: string; hint: string }[] = [
  { key: "bookingUpdates", label: "Booking updates", hint: "Confirmations, cancellations, reminders" },
  { key: "quotes", label: "Quotes", hint: "When a vendor sends or updates a quote" },
  { key: "messages", label: "Messages", hint: "New chat messages from vendors" },
];

export function NotificationPrefsForm({ initial }: { initial: Prefs }) {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationPrefs: prefs }),
      });
      if (res.ok) {
        setMsg("Preferences saved.");
        router.refresh();
      } else {
        setMsg("Could not save preferences.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
      <div>
        <h2 className="text-sm font-semibold text-mp-charcoal">Notification preferences</h2>
        <p className="text-xs text-mp-muted">Choose what you want to be notified about.</p>
      </div>
      {msg && <p className="text-xs text-mp-muted">{msg}</p>}
      <div className="space-y-3">
        {ROWS.map((row) => (
          <label key={row.key} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={prefs[row.key]}
              onChange={(e) => setPrefs((p) => ({ ...p, [row.key]: e.target.checked }))}
              className="mt-0.5 h-4 w-4 accent-mp-accent"
            />
            <span>
              <span className="block text-sm text-mp-charcoal">{row.label}</span>
              <span className="block text-xs text-mp-muted">{row.hint}</span>
            </span>
          </label>
        ))}
      </div>
      <button
        onClick={save}
        disabled={busy}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save preferences"}
      </button>
    </section>
  );
}
