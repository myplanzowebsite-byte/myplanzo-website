"use client";

import { useEffect, useRef, useState } from "react";

type Msg = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  readAt: string | null;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function BookingChat({
  bookingId,
  currentUserId,
}: {
  bookingId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  async function load() {
    // Skip if a previous poll is still running, so slow responses can't
    // stack up into an ever-growing backlog of overlapping requests.
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setMessages(data.messages ?? []);
    } finally {
      inFlight.current = false;
    }
  }

  useEffect(() => {
    // No interval polling — the DB is far away and round-trips are slow.
    // Refresh only on real triggers: thread opened, or the user returns to
    // the tab (sending a message also calls load() directly).
    void load();

    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bind once per booking
  }, [bookingId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/bookings/${bookingId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      setBody("");
      load();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-3">
      <h2 className="text-sm font-semibold text-mp-charcoal">Messages</h2>
      <div className="max-h-80 space-y-2 overflow-y-auto px-0.5">
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div
              key={m.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                  mine
                    ? "rounded-br-sm bg-mp-panel text-mp-charcoal"
                    : "rounded-bl-sm bg-cyan-600 text-white"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
              </div>
              <div className="mt-0.5 flex items-center gap-1 px-1 text-[10px] text-mp-text3">
                <span>{formatTime(m.createdAt)}</span>
                {mine && <span>· {m.readAt ? "Read" : "Delivered"}</span>}
              </div>
            </div>
          );
        })}
        {messages.length === 0 ? (
          <p className="text-mp-muted text-xs">No messages yet.</p>
        ) : null}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          placeholder="Type a message"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-mp-charcoal px-3 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </div>
  );
}
