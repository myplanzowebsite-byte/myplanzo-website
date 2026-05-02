"use client";

import { useEffect, useState } from "react";

type Msg = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
};

export function BookingChat({ bookingId }: { bookingId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch(`/api/bookings/${bookingId}/messages`);
    const data = await res.json().catch(() => ({}));
    if (res.ok) setMessages(data.messages ?? []);
  }

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- poll by bookingId only
  }, [bookingId]);

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
      <div className="max-h-64 space-y-2 overflow-y-auto text-sm">
        {messages.map((m) => (
          <div key={m.id} className="rounded-md bg-mp-panel px-3 py-2">
            {m.body}
          </div>
        ))}
        {messages.length === 0 ? <p className="text-mp-muted text-xs">No messages yet.</p> : null}
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
