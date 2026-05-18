"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SupportToggle({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/support/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handled: !handled }),
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-md border px-3 py-1.5 text-xs transition-colors disabled:opacity-60 ${
        handled
          ? "border-mp-border text-mp-muted hover:bg-mp-warm"
          : "border-mp-charcoal bg-mp-charcoal text-mp-panel hover:bg-mp-accent"
      }`}
    >
      {handled ? "Reopen" : "Mark handled"}
    </button>
  );
}
