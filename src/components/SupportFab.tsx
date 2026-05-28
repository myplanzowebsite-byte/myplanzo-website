"use client";

import { useState } from "react";
import Link from "next/link";

// Floating "Need help?" button that follows the user across the logged-in app
// and offers quick links to FAQ search and the contact form.
export function SupportFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Customer support"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-mp-charcoal text-mp-panel shadow-[var(--shadow-mp-card)] transition hover:bg-mp-accent"
      >
        <span className="text-lg" aria-hidden>💬</span>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-40 w-72 rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-mp-charcoal">Need a hand?</p>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="text-mp-muted hover:text-mp-charcoal"
            >
              ✕
            </button>
          </div>
          <p className="mt-1 text-xs text-mp-muted">
            We&apos;re here for you — usually reply within a few hours.
          </p>
          <div className="mt-3 grid gap-2">
            <Link
              href="/help"
              onClick={() => setOpen(false)}
              className="rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-xs text-mp-charcoal hover:border-mp-accent"
            >
              🔎 Search FAQ
            </Link>
            <Link
              href="/help#contact"
              onClick={() => setOpen(false)}
              className="rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-xs text-mp-charcoal hover:border-mp-accent"
            >
              ✉️ Message support
            </Link>
            <a
              href="mailto:support@myplanzo.com?subject=MyPlanzo%20support%20request"
              className="rounded-md bg-mp-charcoal px-3 py-2 text-center text-xs font-medium text-mp-panel hover:bg-mp-accent"
            >
              📧 Email support
            </a>
          </div>
        </div>
      )}
    </>
  );
}
