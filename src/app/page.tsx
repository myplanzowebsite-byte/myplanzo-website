"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logoImage from "../../logo.jpg";
import {
  ArrowRight,
  CalendarDays,
  Instagram,
  Linkedin,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Store,
  Users,
  Youtube,
} from "lucide-react";

const defaultEventTypes = [
  { emoji: "🎂", title: "Event Photographer", description: "Decor, cakes, photo booths, and entertainers for every age." },
  { emoji: "🧆", title: "Caterer", description: "Soft styling, welcome tables, and keepsake-friendly setups." },
  { emoji: "💍", title: "Decorators", description: "Elegant decor and dining experiences for meaningful evenings." },
  { emoji: "👋", title: "Venues", description: "Well-paced planning for office send-offs and personal milestones." },
  { emoji: "🏢", title: "Corporate Events", description: "Clean, reliable support for launches, mixers, and team events." },
  { emoji: "🌸", title: "Kitty Parties", description: "Pretty backdrops, hosts, and compact packages that feel special." },
];

const processSteps = [
  { title: "Tell us your event", copy: "Choose the occasion, area, and vibe you want for the celebration.", icon: Search },
  { title: "Compare options", copy: "Browse clean vendor cards with pricing direction and service details.", icon: Users },
  { title: "Discuss the plan", copy: "Share requirements, date expectations, and any custom notes clearly.", icon: MessageSquare },
  { title: "Book confidently", copy: "Keep confirmations and next steps in one calmer workflow.", icon: ShieldCheck },
];

const reasons = [
  { title: "Clear vendor profiles", copy: "Each listing is presented clearly so customers can compare faster and with less guesswork.", icon: ShieldCheck },
  { title: "Built for Indian events", copy: "The experience is shaped around birthdays, baby showers, farewells, and family celebrations.", icon: Users },
  { title: "Cleaner coordination", copy: "Shortlists, bookings, and follow-ups stay more organized than scattered chats and calls.", icon: CalendarDays },
  { title: "Helpful for vendors too", copy: "Professionals get a simpler way to manage inquiries, listings, and repeat interest.", icon: Store },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "LinkedIn", href: "#", icon: Linkedin },
  { label: "YouTube", href: "#", icon: Youtube },
  { label: "Email", href: "mailto:hello@myplanzo.com", icon: Mail },
];

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Browse vendors", href: "/customer/browse" },
      { label: "Birthday parties", href: "#events" },
      { label: "Baby showers", href: "#events" },
      { label: "How it works", href: "#how" },
    ],
  },
  {
    title: "For Vendors",
    links: [
      { label: "Register as a vendor", href: "/register" },
      { label: "Vendor dashboard", href: "/vendor" },
      { label: "List your business", href: "/register" },
      { label: "Support", href: "mailto:hello@myplanzo.com" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "#about" },
      { label: "Contact", href: "mailto:hello@myplanzo.com" },
      { label: "Terms & conditions", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

const getCategoryEmoji = (category: string) => {
  const map: Record<string, string> = {
    Venues: "🏛️", Decorators: "🎈", Caterers: "🍽️",
    "Photographers and videographers": "📸",
  };
  return map[category] || "🏢";
};

const heroCards = [
  { name: "Signature Venues", category: "Venues", price: "₹25,000+", meta: "Banquet halls • lawns • intimate spaces", emoji: "🏛️" },
  { name: "Bloom Decor Co.", category: "Decorators", price: "₹12,000+", meta: "Backdrops • florals • stage styling", emoji: "🎈" },
];

export default function HomePage() {
  const [eventTypes, setEventTypes] = useState(defaultEventTypes);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/event-types")
      .then((r) => r.json())
      .then(setEventTypes)
      .catch(() => setEventTypes(defaultEventTypes));

    fetch("/api/listings")
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch(() => setListings([]));
  }, []);

  return (
    /*
     * Single gradient spans the entire page.
     * Sections are transparent — cards float on top.
     * Why choose us and Footer are solid and visually cut through.
     */
    <main className="min-h-screen bg-gradient-to-b from-mp-steel-light via-mp-canvas to-mp-taupe-light">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-mp-border bg-mp-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="overflow-hidden rounded-xl border border-mp-border bg-mp-card shadow-sm">
              <Image
                src={logoImage}
                alt="MyPlanzo logo"
                width={48}
                height={48}
                priority
                className="h-12 w-12 object-cover"
                style={{ objectPosition: "center 35%" }}
              />
            </div>
            <span className="font-semibold text-mp-charcoal">
              My<span className="text-mp-accent">Planzo</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            {[["Events", "#events"], ["Vendors", "#vendors"], ["How it works", "#how"], ["About", "#about"]].map(([label, href]) => (
              <a key={label} href={href} className="text-mp-muted transition-colors hover:text-mp-charcoal">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/vendor"
              className="rounded-full border border-mp-accent px-4 py-2 text-sm font-medium text-mp-accent transition-colors hover:bg-mp-accent hover:text-white"
            >
              List your business
            </Link>
            <Link
              href="/customer/browse"
              className="rounded-full bg-mp-charcoal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-mp-accent"
            >
              Start planning
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero — transparent over gradient, dark text, white fields ── */}
      <section className="border-b border-mp-border">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">

          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mp-border bg-mp-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-mp-accent">
              Now planning across Mumbai
            </div>

            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-mp-charcoal sm:text-5xl">
              Book trusted event vendors{" "}
              <br className="hidden sm:block" />
              in minutes —{" "}
              <span className="text-mp-accent">no calls, no hassle</span>
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-mp-muted sm:text-base">
              Connect with verified vendors, compare pricing instantly, and go from search to booking in minutes.
            </p>

            {/* Search form */}
            <form
              action="/customer/browse"
              className="mt-8 overflow-hidden rounded-[20px] border border-mp-border bg-mp-card p-2 shadow-[var(--shadow-mp-card)]"
            >
              <div className="grid gap-2 md:grid-cols-[0.95fr_1.1fr_auto]">
                <select
                  name="event"
                  defaultValue="Birthday Party"
                  className="rounded-xl border border-mp-border bg-white px-3 py-3 text-sm text-mp-charcoal outline-none focus:border-mp-accent focus:ring-2 focus:ring-mp-accent/20"
                >
                  <option>Birthday Party</option>
                  <option>Baby Shower</option>
                  <option>Anniversary</option>
                  <option>Farewell</option>
                  <option>Corporate Event</option>
                </select>
                <input
                  name="location"
                  placeholder="Enter location in Mumbai..."
                  className="rounded-xl border border-mp-border bg-white px-3 py-3 text-sm text-mp-charcoal outline-none placeholder:text-mp-muted/50 focus:border-mp-accent focus:ring-2 focus:ring-mp-accent/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-mp-charcoal px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-mp-accent"
                >
                  Find vendors <ArrowRight className="size-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right — floating white cards */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-[26px] border border-mp-border bg-mp-card shadow-[var(--shadow-mp-card)]">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-mp-steel-light text-6xl">
                <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/20 via-transparent to-transparent" />
                <span aria-hidden>🎉</span>
                <div className="absolute bottom-4 left-4 rounded-full bg-mp-card/90 px-3 py-1 text-xs font-medium text-mp-charcoal shadow-sm">
                  Dream Birthday Party · Andheri West
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-base font-semibold text-mp-charcoal">The Grand Party Package</p>
                  <p className="mt-0.5 text-sm text-mp-muted">Decor · Catering · Photography · Music</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-mp-accent">₹25,000</p>
                  <p className="text-xs text-mp-muted">starting package</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {heroCards.map((v) => (
                <div key={v.name} className="rounded-[20px] border border-mp-border bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mp-steel-light text-lg">
                      {v.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight text-mp-charcoal">{v.name}</p>
                      <p className="text-xs text-mp-muted">{v.category}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-mp-border pt-2">
                    <span className="text-sm font-semibold text-mp-charcoal">{v.price}</span>
                    <Link href="/customer/browse" className="text-xs font-medium text-mp-accent hover:text-mp-accent-strong">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Events — transparent, white cards float above gradient ── */}
      <section id="events" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">Occasions we cover</p>
          <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">Every celebration, thoughtfully planned</h2>
          <p className="mt-3 text-sm leading-6 text-mp-muted">
            From intimate family setups to polished office farewells, MyPlanzo helps you find the right support faster.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((item) => (
            <div key={item.title} className="rounded-[22px] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-mp-steel-light text-2xl">
                {item.emoji}
              </div>
              <h3 className="text-base font-semibold text-mp-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mp-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vendors — transparent, white cards ── */}
      <section id="vendors" className="border-y border-mp-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">Top vendors</p>
              <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">Event professionals on the platform</h2>
            </div>
            <Link href="/customer/browse" className="text-sm font-medium text-mp-accent hover:text-mp-accent-strong">
              View all vendors →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {listings.slice(0, 8).map((listing) => {
              const parts = listing.title.split(" - ");
              const name = parts[0];
              const category = parts[1] || "Service";
              const emoji = getCategoryEmoji(category);
              const price = listing.priceMin ? `₹${listing.priceMin.toLocaleString()}+` : "Contact for pricing";
              const meta = listing.description.length > 55 ? listing.description.slice(0, 55) + "…" : listing.description;
              const reviews: any[] = listing.vendor.reviews ?? [];
              const avgRating = reviews.length
                ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
                : 0;

              return (
                <div key={listing.id} className="flex flex-col overflow-hidden rounded-[22px] border border-mp-border bg-mp-card shadow-[var(--shadow-mp-card)]">
                  <div className="h-28 overflow-hidden bg-mp-steel-light flex items-center justify-center text-4xl">
                    {listing.photos?.[0]
                      ? <img src={listing.photos[0]} alt={listing.title} className="h-full w-full object-cover" />
                      : emoji}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-mp-accent">{category}</p>
                    <h3 className="text-sm font-semibold text-mp-charcoal">{name}</h3>
                    {avgRating > 0 && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="flex gap-px">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(avgRating) ? "text-mp-accent" : "text-mp-border"}`}>★</span>
                          ))}
                        </span>
                        <span className="text-xs text-mp-muted">{avgRating.toFixed(1)} ({reviews.length})</span>
                      </div>
                    )}
                    {listing.vendor.eventsCompleted > 0 && (
                      <p className="mt-1 text-xs text-mp-muted">✓ {listing.vendor.eventsCompleted} events done</p>
                    )}
                    <p className="mt-2 line-clamp-2 text-xs text-mp-muted">{meta}</p>
                    <div className="mt-auto mt-4 flex items-center justify-between border-t border-mp-border pt-3">
                      <span className="text-sm font-semibold text-mp-charcoal">{price}</span>
                      <Link href={`/customer/listings/${listing.id}`} className="text-xs font-medium text-mp-accent hover:text-mp-accent-strong">
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works — transparent, white cards ── */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 max-w-2xl text-center md:mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">A simpler way to plan in four steps</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-[22px] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${i === 0 ? "bg-mp-charcoal text-white" : "bg-mp-steel-light text-mp-charcoal"}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-mp-border">0{i + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-mp-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mp-muted">{step.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Why choose us — solid, supersedes gradient ── */}
      <section id="about" className="bg-mp-accent py-10 text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent-soft">Why choose us</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">A calmer, more useful way to plan events</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-mp-accent-soft">
              The platform is designed to feel polished and practical — not noisy — so families and teams can move faster with more confidence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {reasons.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-[20px] border border-mp-accent-soft/25 bg-mp-accent-strong/30 p-4">
                  <div className="mb-3 inline-flex rounded-xl bg-mp-accent-soft/20 p-2 text-white">
                    <Icon className="size-4" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mp-accent-soft">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vendor CTA — mint white card, steel blue secondary button ── */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-[28px] border border-mp-border bg-white px-6 py-8 shadow-[var(--shadow-mp-card)] md:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">For vendors and professionals</p>
              <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal">Grow your event business with a cleaner workflow.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-mp-muted">
                Create listings, respond to inquiries, and manage bookings from a single dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[200px]">
              <Link
                href="/register"
                className="rounded-full bg-mp-charcoal px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-mp-accent"
              >
                Register as a vendor
              </Link>
              <Link
                href="/vendor"
                className="rounded-full bg-mp-charcoal px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-mp-accent"
              >
                Open vendor area
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer — solid charcoal, supersedes gradient ── */}
      <footer className="border-t border-mp-border bg-mp-charcoal text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center">
              <div className="overflow-hidden rounded-full border border-white/20 bg-mp-card shadow-sm">
                <Image
                  src={logoImage}
                  alt="MyPlanzo logo"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-cover"
                  style={{ objectPosition: "center 35%" }}
                />
              </div>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/60">
              A modern event marketplace for discovering vendors, coordinating bookings, and keeping celebration planning more organized.
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition-colors hover:bg-mp-accent"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/50">{group.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors hover:text-white">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
            <span>© 2026 MyPlanzo. All rights reserved.</span>
            <span>Designed for calmer event planning.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
