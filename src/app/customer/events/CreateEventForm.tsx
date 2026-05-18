"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELD =
  "rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

export function CreateEventForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Give your event a name.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/customer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          eventType: eventType || undefined,
          eventDate: date ? new Date(date).toISOString() : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not create event.");
        return;
      }
      setName("");
      setEventType("");
      setDate("");
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
      >
        + New event
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]"
    >
      <h2 className="text-sm font-semibold text-mp-charcoal">Create an event</h2>
      {error && (
        <p className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-xs text-mp-accent">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event name (e.g. Aarav's 1st Birthday)"
          className={`${FIELD} sm:col-span-3`}
        />
        <input
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          placeholder="Type (Birthday, Baby Shower…)"
          className={`${FIELD} sm:col-span-2`}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={FIELD}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create event"}
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
