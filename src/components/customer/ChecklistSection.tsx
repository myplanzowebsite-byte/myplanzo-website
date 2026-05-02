"use client";

import { useEffect, useState } from "react";

type Item = { id: string; title: string; done: boolean };

export function ChecklistSection({ bookingId }: { bookingId: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");

  async function load() {
    const res = await fetch(`/api/bookings/${bookingId}/checklist`);
    const data = await res.json().catch(() => ({}));
    if (res.ok) setItems(data.items ?? []);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch(`/api/bookings/${bookingId}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    load();
  }

  async function toggle(item: Item) {
    await fetch(`/api/bookings/${bookingId}/checklist/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !item.done }),
    });
    load();
  }

  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-3">
      <h2 className="text-sm font-semibold text-mp-charcoal">Event checklist</h2>
      <ul className="space-y-2 text-sm">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-2">
            <input type="checkbox" checked={it.done} onChange={() => toggle(it)} />
            <span className={it.done ? "line-through text-mp-muted" : ""}>{it.title}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          placeholder="New task"
        />
        <button
          type="submit"
          className="rounded-md bg-mp-charcoal px-3 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent"
        >
          Add
        </button>
      </form>
    </div>
  );
}
