"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SiteHeaderProps {
  /** Extra nav links shown when user is logged in (e.g. Browse, Shortlist, Bookings) */
  navLinks?: { label: string; href: string; badge?: number }[];
  /** Show logout button instead of Log in / Sign up */
  isLoggedIn?: boolean;
}

function Badge({ count }: { count: number }) {
  return (
    <span
      className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white"
      style={{ background: "var(--color-mp-accent)" }}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function SiteHeader({ navLinks, isLoggedIn }: SiteHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/browse?event=${encodeURIComponent(query.trim())}`);
  }

  const hasNav = !!(navLinks && navLinks.length > 0);

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center gap-3.5 border-b px-6 backdrop-blur-md"
        style={{
          background: "rgba(15,15,15,0.94)",
          borderColor: "var(--color-mp-border)",
          height: 60,
          fontFamily: "var(--font-jakarta, var(--font-sans))",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex flex-shrink-0 items-center no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="MyPlanzo"
            style={{ height: 40, width: "auto", filter: "invert(1)" }}
          />
        </Link>

        {/* Inline search (hidden on mobile) */}
        <form
          onSubmit={handleNavSearch}
          className="hidden flex-1 items-center gap-2 rounded-[10px] border px-3.5 transition-colors focus-within:border-[var(--color-mp-steel)] md:flex"
          style={{ maxWidth: 500, background: "var(--color-mp-panel)", borderColor: "var(--color-mp-border)", height: 38 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendors, services…"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--color-mp-charcoal)", fontFamily: "inherit" }}
          />
        </form>

        {/* Extra nav links — desktop only */}
        {hasNav && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks!.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-mp-accent-soft)] hover:text-[var(--color-mp-charcoal)]"
                style={{ color: "var(--color-mp-muted)" }}
              >
                {l.label}
                {l.badge ? <Badge count={l.badge} /> : null}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Logout — desktop only */}
              <form action="/api/auth/logout" method="post" className="hidden md:block">
                <button
                  type="submit"
                  className="rounded-lg border px-3.5 py-1.5 text-[0.8rem] font-medium transition-all hover:border-[#444] hover:text-[var(--color-mp-charcoal)]"
                  style={{ borderColor: "var(--color-mp-border)", color: "var(--color-mp-muted)", fontFamily: "inherit" }}
                >
                  Log out
                </button>
              </form>
              {/* Hamburger — mobile only */}
              {hasNav && (
                <button
                  type="button"
                  aria-label="Open menu"
                  onClick={() => setMenuOpen(true)}
                  className="md:hidden"
                  style={{ color: "var(--color-mp-muted)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border px-3.5 py-1.5 text-[0.8rem] font-medium transition-all hover:border-[#444] hover:text-[var(--color-mp-charcoal)]"
                style={{ borderColor: "var(--color-mp-border)", color: "var(--color-mp-muted)" }}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg px-4 py-1.5 text-[0.8rem] font-semibold text-white transition-opacity hover:opacity-85"
                style={{ background: "var(--color-mp-steel)" }}
              >
                Sign up free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile drawer */}
      {hasNav && menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.55)" }}
          />
          {/* Panel */}
          <aside
            className="absolute right-0 top-0 flex h-full w-[270px] flex-col gap-1 px-4 py-5"
            style={{ background: "rgba(15,15,15,0.99)", borderLeft: "1px solid var(--color-mp-border)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "var(--color-mp-charcoal)" }}>
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                style={{ color: "var(--color-mp-muted)" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {navLinks!.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-[var(--color-mp-accent-soft)]"
                style={{ color: "var(--color-mp-muted)" }}
              >
                {l.label}
                {l.badge ? <Badge count={l.badge} /> : null}
              </Link>
            ))}

            <form action="/api/auth/logout" method="post" className="mt-auto">
              <button
                type="submit"
                className="w-full rounded-lg border px-3.5 py-2 text-[0.8rem] font-medium transition-all hover:border-[#444]"
                style={{ borderColor: "var(--color-mp-border)", color: "var(--color-mp-muted)" }}
              >
                Log out
              </button>
            </form>
          </aside>
        </div>
      )}
    </>
  );
}
