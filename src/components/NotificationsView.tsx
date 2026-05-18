"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

const TYPE_EMOJI: Record<string, string> = {
  quote: "💬",
  booking: "📅",
  payment: "💳",
  message: "✉️",
  reminder: "⏰",
  system: "🔔",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function NotificationsView() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/notifications");
    const data = await res.json().catch(() => ({}));
    if (res.ok) setItems(data.notifications ?? []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function markAll() {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    await load();
    router.refresh();
  }

  async function open(n: Notification) {
    if (!n.readAt) {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n.id }),
      });
    }
    if (n.link) router.push(n.link);
    else void load();
  }

  const unread = items.filter((n) => !n.readAt).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-mp-charcoal">Notifications</h1>
        {unread > 0 && (
          <button
            onClick={markAll}
            className="text-sm text-mp-accent underline"
          >
            Mark all read ({unread})
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => open(n)}
              className={`flex w-full items-start gap-3 rounded-[var(--radius-mp-card)] p-4 text-left shadow-[var(--shadow-mp-card)] transition hover:ring-2 ring-mp-charcoal/10 ${
                n.readAt ? "bg-mp-card" : "bg-mp-warm"
              }`}
            >
              <span className="text-lg leading-none">{TYPE_EMOJI[n.type] ?? "🔔"}</span>
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium text-mp-charcoal">{n.title}</span>
                  <span className="shrink-0 text-[11px] text-mp-text3">
                    {timeAgo(n.createdAt)}
                  </span>
                </span>
                {n.body && <span className="mt-0.5 block text-sm text-mp-muted">{n.body}</span>}
              </span>
              {!n.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mp-accent" />}
            </button>
          </li>
        ))}
        {loaded && items.length === 0 && (
          <p className="text-sm text-mp-muted">No notifications yet.</p>
        )}
      </ul>
    </div>
  );
}
