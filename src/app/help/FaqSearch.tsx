"use client";

import { useState } from "react";

type Faq = { id: string; question: string; answer: string };

export function FaqSearch({ faqs }: { faqs: Faq[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const term = q.trim().toLowerCase();
  const filtered = term
    ? faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term),
      )
    : faqs;

  return (
    <div className="space-y-3">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search help articles…"
        className="w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
      />
      <div className="divide-y divide-mp-border rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card">
        {filtered.map((f) => (
          <div key={f.id}>
            <button
              onClick={() => setOpen((o) => (o === f.id ? null : f.id))}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-mp-charcoal"
            >
              {f.question}
              <span className="text-mp-muted">{open === f.id ? "−" : "+"}</span>
            </button>
            {open === f.id && (
              <p className="px-4 pb-3 text-sm text-mp-muted whitespace-pre-wrap">{f.answer}</p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-mp-muted">
            No articles match &ldquo;{q}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
