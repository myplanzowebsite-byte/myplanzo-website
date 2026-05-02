"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ToggleBlockButton({ userId, blocked }: { userId: string; blocked: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, { method: "POST" });
      if (res.ok) router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="w-full rounded-lg border border-mp-border bg-mp-card py-2 text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-panel disabled:opacity-50"
    >
      {loading ? "Updating…" : blocked ? "Unblock account" : "Block account"}
    </button>
  );
}
