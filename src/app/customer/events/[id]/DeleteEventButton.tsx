"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this event? Linked bookings will be kept but unlinked.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/customer/events/${eventId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/customer/events");
        router.refresh();
      } else {
        setBusy(false);
      }
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="shrink-0 rounded-md border border-mp-border px-3 py-1.5 text-xs text-mp-muted transition-colors hover:border-mp-accent/40 hover:text-mp-accent disabled:opacity-60"
    >
      {busy ? "Deleting…" : "Delete event"}
    </button>
  );
}
