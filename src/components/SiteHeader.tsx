"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SiteHeaderProps {
  /** Extra nav links shown when user is logged in (e.g. Browse, Shortlist, Bookings) */
  navLinks?: { label: string; href: string }[];
  /** Show logout button instead of Log in / Sign up */
  isLoggedIn?: boolean;
}

export function SiteHeader({ navLinks, isLoggedIn }: SiteHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleNavSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/browse?event=${encodeURIComponent(query.trim())}`);
  }

  return (
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
          src="/logo.jpg"
          alt="MyPlanzo"
          style={{ height: 36, width: "auto", filter: "invert(1)" }}
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
        <div
          className="flex cursor-pointer items-center gap-1 border-l pl-2.5 text-xs"
          style={{ borderColor: "var(--color-mp-border)", color: "var(--color-mp-muted)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          Mumbai ▾
        </div>
      </form>

      {/* Optional extra nav links (logged-in customer) */}
      {navLinks && navLinks.length > 0 && (
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-1.5 text-sm transition-colors hover:bg-[var(--color-mp-accent-soft)] hover:text-[var(--color-mp-charcoal)]"
              style={{ color: "var(--color-mp-muted)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Auth buttons */}
      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        {isLoggedIn ? (
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border px-3.5 py-1.5 text-[0.8rem] font-medium transition-all hover:border-[#444] hover:text-[var(--color-mp-charcoal)]"
              style={{ borderColor: "var(--color-mp-border)", color: "var(--color-mp-muted)", fontFamily: "inherit" }}
            >
              Log out
            </button>
          </form>
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
  );
}
