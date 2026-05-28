"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VendorCard, type VendorCardData } from "@/components/VendorCard";
import { MOCK_LISTINGS, normalizeSearchInput } from "@/lib/mockListings";
import { formatINR, priceUnitForListing } from "@/lib/format";

// ── Static data ───────────────────────────────────────────────────────────────

// Mixed strip: event types first, then vendor categories. Clicking a chip
// routes to /browse with the right query param (event= or category=).
const CATEGORIES: { emoji: string; label: string; kind: "event" | "category" }[] = [
  { emoji: "🎂", label: "Birthday", kind: "event" },
  { emoji: "👶", label: "Baby Shower", kind: "event" },
  { emoji: "💍", label: "Anniversary", kind: "event" },
  { emoji: "👋", label: "Farewell", kind: "event" },
  { emoji: "🏢", label: "Corporate", kind: "event" },
  { emoji: "🌸", label: "Kitty Party", kind: "event" },
  { emoji: "🎀", label: "Decorators", kind: "category" },
  { emoji: "📸", label: "Photographers", kind: "category" },
  { emoji: "🍽️", label: "Caterers", kind: "category" },
  { emoji: "🏛️", label: "Venues", kind: "category" },
  { emoji: "🎵", label: "DJ & Music", kind: "category" },
  { emoji: "🎂", label: "Cake", kind: "category" },
];

const VENDORS: VendorCardData[] = MOCK_LISTINGS.slice(0, 6).map((m) => ({
  id: m.id,
  name: m.vendorName,
  category: m.category,
  meta: `${m.location} · ${m.reviewCount} events`,
  rating: m.rating,
  countLabel: `${m.reviewCount} events`,
  price: formatINR(m.priceMin),
  unit: priceUnitForListing({ title: m.title, eventTags: m.eventTags }),
  img: m.photos[0],
  waPhone: m.waPhone,
  href: `/listings/${m.id}`,
  buttonLabel: "View →",
  verified: true,
}));

const REVIEWS = [
  { text: "Found a decorator in 5 minutes. My daughter's birthday setup was beyond what I imagined.", name: "Priya Rao", event: "Birthday · Andheri", initials: "PR", color: "#7aafc0" },
  { text: "Caterer fed 80 guests at our baby shower. Food was incredible and booked in 20 minutes.", name: "Neha Kulkarni", event: "Baby Shower · Powai", initials: "NK", color: "#c4956a" },
  { text: "Organized my team farewell entirely through MyPlanzo. Venue, photographer, cake — one afternoon.", name: "Arjun Shah", event: "Farewell · BKC", initials: "AS", color: "#3aab6e" },
  { text: "Real prices shown upfront. No 'call for pricing' nonsense. Booked our anniversary venue confidently.", name: "Sanjana & Mehul", event: "Anniversary · Bandra", initials: "SM", color: "#7a4e5d" },
  { text: "Chatted with 3 decorators in-app, compared their quotes side-by-side, and confirmed the same evening.", name: "Ruchika Desai", event: "Kitty Party · Malad", initials: "RD", color: "#7aafc0" },
  { text: "Used MyPlanzo for our product launch. Professional vendors, zero drama. Using it for every event now.", name: "Vikram Joshi", event: "Corporate · Lower Parel", initials: "VJ", color: "#c4956a" },
];

const HOW_STEPS = [
  { n: "1", title: "Search", desc: "Browse verified vendors by event type and area in Mumbai" },
  { n: "2", title: "Chat & Quote", desc: "Discuss your requirements in-app — vendor sends you a custom quote card" },
  { n: "3", title: "Pay Securely", desc: "Accept the quote and pay through MyPlanzo — your money is held safely until the event" },
  { n: "4", title: "Celebrate", desc: "Event done? Confirm completion — vendor is paid automatically. Zero hassle." },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [activeCat, setActiveCat] = useState(0);
  const [searchWhat, setSearchWhat] = useState("");
  const [searchWhere, setSearchWhere] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchWhat) {
      // Try to map "Birthday party", "decorator", "photography" etc. to the
      // canonical category/event filter. Anything else falls through as `q`.
      const norm = normalizeSearchInput(searchWhat);
      if (norm.category) params.set("category", norm.category);
      else if (norm.event) params.set("event", norm.event);
      else if (norm.q) params.set("q", norm.q);
    }
    if (searchWhere) params.set("zone", searchWhere);
    router.push(`/browse${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <div
      style={{
        fontFamily: "var(--font-jakarta, var(--font-sans))",
        background: "var(--color-mp-canvas)",
        color: "var(--color-mp-charcoal)",
        overflowX: "hidden",
      }}
    >

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        className="px-6 pb-9 pt-[52px] text-center"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,138,166,.10) 0%, transparent 70%)",
        }}
      >
        <h1
          className="mb-3 font-bold leading-[1.12] tracking-[-0.03em]"
          style={{ fontSize: "clamp(1.9rem, 4.5vw, 3rem)", color: "var(--color-mp-charcoal)" }}
        >
          Book the best vendors<br />for your{" "}
          <span style={{ color: "var(--color-mp-steel)" }}>celebration.</span>
        </h1>

        <p
          className="mx-auto mb-7"
          style={{ fontSize: "0.95rem", color: "var(--color-mp-muted)", maxWidth: 380, lineHeight: 1.65 }}
        >
          Decorators, caterers, photographers, venues — all in one place. No calls, no hassle.
        </p>

        {/* Hero search bar */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mb-8 flex items-center gap-2 rounded-[14px] border px-5 py-1.5 transition-shadow focus-within:shadow-[0_0_0_2px_var(--color-mp-steel)] focus-within:border-transparent"
          style={{ maxWidth: 580, background: "var(--color-mp-panel)", borderColor: "var(--color-mp-border)" }}
        >
          <div className="flex-1">
            <label className="block text-[0.6rem] font-bold uppercase tracking-[0.07em]" style={{ color: "var(--color-mp-text3)" }}>
              What are you planning?
            </label>
            <input
              value={searchWhat}
              onChange={(e) => setSearchWhat(e.target.value)}
              placeholder="Birthday party, baby shower…"
              className="w-full bg-transparent text-[0.875rem] outline-none"
              style={{ color: "var(--color-mp-charcoal)", fontFamily: "inherit" }}
            />
          </div>

          <div className="h-[30px] w-px flex-shrink-0" style={{ background: "var(--color-mp-border)" }} />

          <div className="flex-1">
            <label className="block text-[0.6rem] font-bold uppercase tracking-[0.07em]" style={{ color: "var(--color-mp-text3)" }}>
              Where in Mumbai?
            </label>
            <input
              value={searchWhere}
              onChange={(e) => setSearchWhere(e.target.value)}
              placeholder="Andheri, Bandra, Thane…"
              className="w-full bg-transparent text-[0.875rem] outline-none"
              style={{ color: "var(--color-mp-charcoal)", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            className="flex flex-shrink-0 items-center gap-1.5 rounded-[10px] px-5 py-2.5 text-[0.85rem] font-semibold text-white transition-opacity hover:opacity-87"
            style={{ background: "var(--color-mp-steel)", fontFamily: "inherit" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </button>
        </form>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-11">
        <div className="lp-no-scrollbar flex gap-2.5 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat, i) => {
            const param = cat.kind === "category" ? "category" : "event";
            const href = `/browse?${param}=${encodeURIComponent(cat.label)}`;
            return (
              <Link
                key={cat.label + i}
                href={href}
                onClick={() => setActiveCat(i)}
                className="flex flex-shrink-0 cursor-pointer flex-col items-center gap-1.5 rounded-[13px] border px-4 py-3.5 transition-all"
                style={{
                  minWidth: 80,
                  background: activeCat === i ? "rgba(14,138,166,0.12)" : "var(--color-mp-panel)",
                  borderColor: activeCat === i ? "var(--color-mp-steel)" : "var(--color-mp-border)",
                  fontFamily: "inherit",
                  textDecoration: "none",
                }}
              >
                <span className="text-2xl leading-none">{cat.emoji}</span>
                <span
                  className="text-[0.68rem] font-semibold text-center"
                  style={{ color: activeCat === i ? "var(--color-mp-steel)" : "var(--color-mp-muted)" }}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED VENDORS ────────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between px-6">
        <span className="text-[1.05rem] font-bold" style={{ color: "var(--color-mp-charcoal)" }}>
          Featured in Mumbai
        </span>
        <Link href="/browse" className="text-[0.8rem] font-medium hover:opacity-80" style={{ color: "var(--color-mp-steel)" }}>
          See all →
        </Link>
      </div>

      <section className="px-6 pb-14">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))" }}>
          {VENDORS.map((v) => (
            <VendorCard key={v.id} v={v} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section
        id="how"
        className="mx-6 mb-14 scroll-mt-20 rounded-[18px] border p-8"
        style={{ background: "var(--color-mp-panel)", borderColor: "var(--color-mp-border)" }}
      >
        <h3 className="mb-2 text-[1.15rem] font-bold" style={{ color: "var(--color-mp-charcoal)" }}>
          How MyPlanzo works
        </h3>
        <p className="mb-8 text-[0.85rem]" style={{ color: "var(--color-mp-muted)" }}>
          Four steps from browsing to celebrating — your money stays safe until the event is done.
        </p>

        <ol className="relative grid gap-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
          {/* Horizontal connector line for desktop, behind the bubbles */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[10%] right-[10%] top-[22px] hidden h-[2px] xl:block"
            style={{
              background:
                "repeating-linear-gradient(to right, var(--color-mp-steel) 0 8px, transparent 8px 16px)",
            }}
          />

          {HOW_STEPS.map((step, i) => (
            <li key={step.n} className="relative flex flex-col items-center text-center">
              {/* Mobile: vertical connector to the next step */}
              {i < HOW_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[44px] hidden h-[calc(100%-44px+1.5rem)] w-px -translate-x-1/2 sm:block xl:hidden"
                  style={{
                    background:
                      "repeating-linear-gradient(to bottom, var(--color-mp-steel) 0 6px, transparent 6px 12px)",
                  }}
                />
              )}

              <div
                className="relative z-10 mb-3 flex h-11 w-11 items-center justify-center rounded-full text-[0.95rem] font-bold text-white shadow-[0_4px_12px_rgba(14,138,166,0.35)]"
                style={{ background: "var(--color-mp-steel)" }}
              >
                {step.n}
              </div>

              {/* Desktop: arrow chevron pointing to the next bubble */}
              {i < HOW_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-[-12px] top-[14px] hidden xl:block"
                  style={{ color: "var(--color-mp-steel)" }}
                >
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                    <path
                      d="M1 8h18m0 0-6-6m6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}

              <div
                className="mb-1.5 text-[0.95rem] font-semibold"
                style={{ color: "var(--color-mp-charcoal)" }}
              >
                {step.title}
              </div>
              <p
                className="max-w-[220px] text-[0.78rem] leading-[1.55]"
                style={{ color: "var(--color-mp-muted)" }}
              >
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────────────── */}
      <div className="mb-4 px-6">
        <span className="text-[1.05rem] font-bold" style={{ color: "var(--color-mp-charcoal)" }}>
          What people are saying
        </span>
      </div>
      <section className="mb-14 overflow-hidden">
        <div className="pl-6">
          {/* Double the reviews for seamless infinite loop */}
          <div className="lp-marquee flex w-max gap-3">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div
                key={i}
                className="w-[268px] flex-shrink-0 rounded-[13px] border p-4"
                style={{ background: "var(--color-mp-panel)", borderColor: "var(--color-mp-border)" }}
              >
                <div className="mb-2 text-[0.75rem]" style={{ color: "var(--color-mp-gold)" }}>★★★★★</div>
                <p className="mb-3 text-[0.79rem] italic leading-[1.65]" style={{ color: "var(--color-mp-muted)" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[0.68rem] font-bold text-white"
                    style={{ background: r.color }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-[0.77rem] font-semibold" style={{ color: "var(--color-mp-charcoal)" }}>{r.name}</div>
                    <div className="text-[0.65rem]" style={{ color: "var(--color-mp-text3)" }}>{r.event}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VENDOR CTA BANNER ───────────────────────────────────────────────── */}
      <div
        className="relative mx-6 mb-14 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[18px] px-8 py-9 sm:flex-row sm:items-center"
        style={{ background: "linear-gradient(135deg, #0e8aa6 0%, #075f75 100%)" }}
      >
        {/* Decorative circle */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div className="relative z-10">
          <h2 className="mb-1.5 text-[1.2rem] font-bold tracking-[-0.02em] text-white">
            Are you an event vendor in Mumbai?
          </h2>
          <p className="text-[0.82rem] leading-[1.6]" style={{ color: "rgba(255,255,255,0.75)", maxWidth: 300 }}>
            List free. Get real inquiries. Pay only 15% when you earn — zero upfront cost.
          </p>
        </div>
        <Link
          href="/register?role=VENDOR"
          className="relative z-10 flex-shrink-0 rounded-[10px] bg-white px-6 py-3 text-[0.85rem] font-bold transition-opacity hover:opacity-92 sm:w-auto w-full text-center"
          style={{ color: "var(--color-mp-accent)", textDecoration: "none" }}
        >
          List your business →
        </Link>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t px-6 pb-5 pt-8" style={{ borderColor: "var(--color-mp-border)" }}>
        <div className="mb-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="ft-brand">
            <div className="flex items-center gap-1.5 font-bold" style={{ fontSize: "0.95rem", color: "var(--color-mp-charcoal)" }}>
              <div
                className="flex items-center justify-center rounded-[7px] text-[13px]"
                style={{ width: 26, height: 26, background: "var(--color-mp-accent)" }}
              >
                <img
                  src="/logo1.jpeg"
                  alt="MyPlanzo"
                  style={{ height: 26, width: "auto", borderRadius: 8 }}
                />
              </div>
              MyPlanzo Events Private Limited
            </div>
            <p className="mt-2 text-[0.75rem] leading-[1.6]" style={{ color: "var(--color-mp-text3)", maxWidth: 260 }}>
              Helping people plan birthdays, baby showers, farewells, and personal celebrations with trusted vendor discovery and simplified booking.
            </p>
          </div>

          {/* Customers */}
          <div>
            <h4 className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.07em]" style={{ color: "var(--color-mp-muted)" }}>
              Customers
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                ["Browse vendors", "/browse"],
                ["How it works", "/#how"],
                ["Birthdays", "/browse?event=Birthday"],
                ["Baby showers", "/browse?event=Baby%20Shower"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[0.77rem] transition-colors hover:text-[var(--color-mp-charcoal)]" style={{ color: "var(--color-mp-muted)", textDecoration: "none" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h4 className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.07em]" style={{ color: "var(--color-mp-muted)" }}>
              Vendors
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                ["List your business", "/register?role=VENDOR"],
                ["Vendor dashboard", "/vendor"],
                ["Commission policy", "/terms-and-conditions#commission"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[0.77rem] transition-colors hover:text-[var(--color-mp-charcoal)]" style={{ color: "var(--color-mp-muted)", textDecoration: "none" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.07em]" style={{ color: "var(--color-mp-muted)" }}>
              Company
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                ["About us", "/about"],
                ["Contact & Support", "/help#contact"],
                ["Terms & Conditions", "/terms-and-conditions"],
                ["Privacy Policy", "/privacy-policy"],
                ["Refund & Cancellation Policy", "/terms-and-conditions#refund"],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-[0.77rem] transition-colors hover:text-[var(--color-mp-charcoal)]" style={{ color: "var(--color-mp-muted)", textDecoration: "none" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
          style={{ borderColor: "var(--color-mp-border)" }}
        >
          <div className="flex flex-col gap-1 text-[0.68rem]" style={{ color: "var(--color-mp-text3)" }}>
            <p>© 2026 MyPlanzo Events Private Limited. All rights reserved.</p>
            <p>Mumbai, Maharashtra, India</p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.7rem]" style={{ color: "var(--color-mp-text3)" }}>
            <span>
              Contact:{" "}
              <a href="mailto:support@myplanzo.com" className="hover:text-[var(--color-mp-charcoal)]" style={{ color: "var(--color-mp-muted)" }}>
                support@myplanzo.com
              </a>
            </span>
            <span>
              <a href="tel:+919892788527" className="hover:text-[var(--color-mp-charcoal)]" style={{ color: "var(--color-mp-muted)" }}>
                +91 98927 88527
              </a>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
