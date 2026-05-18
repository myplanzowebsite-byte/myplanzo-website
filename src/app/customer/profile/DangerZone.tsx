"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DangerZone() {
  const router = useRouter();
  const [confirm, setConfirm] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customer/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not delete the account.");
        return;
      }
      // Session is cleared server-side — send the user to the public home page.
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-3 rounded-[var(--radius-mp-card)] border border-mp-accent/30 bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
      <div>
        <h2 className="text-sm font-semibold text-mp-accent">Delete account</h2>
        <p className="text-xs text-mp-muted">
          Your personal details are permanently erased and you&apos;ll be signed out. Past
          booking records are retained for the vendors you worked with. This cannot be undone.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-mp-accent/40 px-4 py-2 text-sm font-medium text-mp-accent transition-colors hover:bg-mp-accent-soft"
        >
          Delete my account
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-mp-muted">
            Type <span className="font-semibold text-mp-charcoal">DELETE</span> to confirm.
          </p>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none focus:border-mp-accent"
          />
          <div className="flex gap-2">
            <button
              onClick={remove}
              disabled={busy || confirm !== "DELETE"}
              className="rounded-md bg-mp-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Permanently delete"}
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setConfirm("");
              }}
              className="rounded-md border border-mp-border px-4 py-2 text-sm text-mp-charcoal hover:bg-mp-warm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
