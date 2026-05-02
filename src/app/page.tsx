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

// Default event types (fallback if API fails)
const defaultEventTypes = [
  {
    emoji: "🎂",
    title: "Birthday Parties",
    description: "Decor, cakes, photo booths, and entertainers for every age.",
  },
  {
    emoji: "👶",
    title: "Baby Showers",
    description: "Soft styling, welcome tables, and keepsake-friendly setups.",
  },
  {
    emoji: "💍",
    title: "Anniversaries",
    description: "Elegant decor and dining experiences for meaningful evenings.",
  },
  {
    emoji: "👋",
    title: "Farewells",
    description: "Well-paced planning for office send-offs and personal milestones.",
  },
  {
    emoji: "🏢",
    title: "Corporate Events",
    description: "Clean, reliable support for launches, mixers, and team events.",
  },
  {
    emoji: "🌸",
    title: "Kitty Parties",
    description: "Pretty backdrops, hosts, and compact packages that feel special.",
  },
];

const defaultVendorCategories = [
  { emoji: "🏛️", title: "Venues" },
  { emoji: "🎈", title: "Decorators" },
  { emoji: "🍽️", title: "Caterers" },
  { emoji: "📸", title: "Photographers and videographers" },
];

const processSteps = [
  {
    title: "Tell us your event",
    copy: "Choose the occasion, area, and vibe you want for the celebration.",
    icon: Search,
  },
  {
    title: "Compare options",
    copy: "Browse clean vendor cards with pricing direction and service details.",
    icon: Users,
  },
  {
    title: "Discuss the plan",
    copy: "Share requirements, date expectations, and any custom notes clearly.",
    icon: MessageSquare,
  },
  {
    title: "Book confidently",
    copy: "Keep confirmations and next steps in one calmer workflow.",
    icon: ShieldCheck,
  },
];

const reasons = [
  {
    title: "Clear vendor profiles",
    copy: "Each listing is presented clearly so customers can compare faster and with less guesswork.",
    icon: ShieldCheck,
  },
  {
    title: "Built for Indian events",
    copy: "The experience is shaped around birthdays, baby showers, farewells, and family celebrations.",
    icon: Users,
  },
  {
    title: "Cleaner coordination",
    copy: "Shortlists, bookings, and follow-ups stay more organized than scattered chats and calls.",
    icon: CalendarDays,
  },
  {
    title: "Helpful for vendors too",
    copy: "Professionals get a simpler way to manage inquiries, listings, and repeat interest.",
    icon: Store,
  },
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

export default function HomePage() {
  const [eventTypes, setEventTypes] = useState(defaultEventTypes);
  const [vendorCategories, setVendorCategories] = useState(defaultVendorCategories);

  useEffect(() => {
    // Fetch event types
    fetch("/api/event-types")
      .then((res) => res.json())
      .then((data) => setEventTypes(data))
      .catch(() => setEventTypes(defaultEventTypes));

    // Fetch vendor categories
    fetch("/api/vendor-categories")
      .then((res) => res.json())
      .then((data) => setVendorCategories(data))
      .catch(() => setVendorCategories(defaultVendorCategories));
  }, []);

  const featuredVendors = [
    {
      name: "Signature Venues",
      category: "Venues",
      price: "₹25,000+",
      meta: "Banquet halls • lawns • intimate spaces",
      emoji: "🏛️",
    },
    {
      name: "Bloom Decor Co.",
      category: "Decorators",
      price: "₹12,000+",
      meta: "Backdrops • florals • stage styling",
      emoji: "🎈",
    },
    {
      name: "Spice Route Catering",
      category: "Caterers",
      price: "₹350/plate",
      meta: "Buffets • live counters • service",
      emoji: "🍽️",
    },
    {
      name: "Lens & Light Studio",
      category: "Photographers & videographers",
      price: "₹8,000+",
      meta: "Photo coverage • films • edited reels",
      emoji: "📸",
    },
  ];

  return (
    <main className="min-h-screen bg-mp-canvas">
      <header className="sticky top-0 z-20 border-b border-mp-border bg-mp-card/90 backdrop-blur-md">
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

  <div>
    My<span className="text-mp-accent">Planzo</span>
  </div>
</Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#events" className="text-mp-muted transition-colors hover:text-mp-charcoal">
              Events
            </a>
            <a href="#vendors" className="text-mp-muted transition-colors hover:text-mp-charcoal">
              Vendors
            </a>
            <a href="#how" className="text-mp-muted transition-colors hover:text-mp-charcoal">
              How it works
            </a>
            <a href="#about" className="text-mp-muted transition-colors hover:text-mp-charcoal">
              About
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/vendor"
              className="rounded-full border border-mp-accent px-4 py-2 text-sm font-medium text-mp-accent transition-colors hover:bg-mp-accent hover:text-mp-panel"
            >
              List your business
            </Link>
            <Link
              href="/customer/browse"
              className="rounded-full bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
            >
              Plan an event
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-mp-border/70 bg-gradient-to-br from-mp-panel via-mp-card to-mp-warm">
        <div className="absolute left-[-4rem] top-8 h-40 w-40 rounded-full bg-mp-soft-blue/70 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-mp-accent-soft/70 blur-3xl" aria-hidden />
        <div className="absolute right-[18%] top-[32%] h-28 w-28 rounded-full bg-mp-warm/80 blur-3xl" aria-hidden />

        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-mp-border bg-mp-soft-blue px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-mp-accent">
              Now planning across Mumbai
            </div>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-mp-charcoal sm:text-5xl">
              Plan every moment <span className="text-mp-accent">beautifully</span>, together.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-mp-muted sm:text-base">
              Find the right vendors, compare simple packages, and move from idea to booking without the usual event-planning clutter.
            </p>

            <form action="/customer/browse" className="mt-6 rounded-[20px] border border-mp-border bg-mp-card p-2 shadow-[var(--shadow-mp-card)]">
              <div className="grid gap-2 md:grid-cols-[0.95fr_1.1fr_auto]">
                <select
                  name="event"
                  defaultValue="Birthday Party"
                  className="rounded-xl border border-mp-border bg-mp-panel px-3 py-3 text-sm text-mp-charcoal outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
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
                  className="rounded-xl border border-mp-border bg-mp-panel px-3 py-3 text-sm text-mp-charcoal outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-mp-charcoal px-4 py-3 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
                >
                  Find vendors <ArrowRight className="size-4" />
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-mp-muted">
              {eventTypes.slice(0, 4).map((item) => (
                <span key={item.title} className="rounded-full border border-mp-border bg-mp-card px-3 py-1.5">
                  {item.emoji} {item.title}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-8 h-20 w-20 rounded-full bg-mp-soft-blue/70 blur-2xl" aria-hidden />
            <div className="absolute -right-4 bottom-10 h-24 w-24 rounded-full bg-mp-accent-soft/80 blur-2xl" aria-hidden />

            <div className="overflow-hidden rounded-[26px] border border-mp-border bg-mp-card shadow-[var(--shadow-mp-card)]">
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-mp-soft-blue via-mp-panel to-mp-accent-soft text-6xl">
                <div className="absolute inset-0 bg-gradient-to-t from-mp-charcoal/30 via-transparent to-transparent" aria-hidden />
                <span aria-hidden>🎉</span>
                <div className="absolute bottom-4 left-4 rounded-full bg-mp-card/90 px-3 py-1 text-xs font-medium text-mp-charcoal shadow-sm">
                  Dream Birthday Party · Andheri West
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-base font-semibold text-mp-charcoal">The Grand Party Package</p>
                  <p className="mt-1 text-sm text-mp-muted">Decor · Catering · Photography · Music</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-mp-accent">₹25,000</p>
                  <p className="text-xs text-mp-muted">starting package</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {featuredVendors.slice(0, 2).map((vendor) => (
                <div
                  key={vendor.name}
                  className="rounded-[20px] border border-mp-border bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mp-accent-soft text-xl">
                      {vendor.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-mp-charcoal">{vendor.name}</p>
                      <p className="text-xs text-mp-muted">{vendor.category}</p>
                    </div>
                  </div>
                  <p className="text-sm text-mp-muted">{vendor.meta}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-mp-border pt-3">
                    <span className="text-sm font-semibold text-mp-charcoal">{vendor.price}</span>
                    <Link
                      href="/customer/browse"
                      className="text-sm font-medium text-mp-accent transition-colors hover:text-mp-charcoal"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">Occasions we cover</p>
          <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">Every celebration, thoughtfully planned</h2>
          <p className="mt-3 text-sm leading-6 text-mp-muted">
            From intimate family setups to polished office farewells, MyPlanzo helps you find the right support faster — and many more occasion types can fit into the same flow.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {eventTypes.map((item) => (
            <div key={item.title} className="rounded-[22px] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-mp-accent-soft text-2xl">
                {item.emoji}
              </div>
              <h3 className="text-base font-semibold text-mp-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-mp-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="vendors" className="border-y border-mp-border bg-mp-panel/80">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">Top vendors</p>
              <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">Event professionals on the platform</h2>
            </div>
            <Link href="/customer/browse" className="text-sm font-medium text-mp-accent hover:text-mp-charcoal">
              View all vendors
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {vendorCategories.map((cat) => (
              <div key={cat.title} className="rounded-[22px] border border-mp-border bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
                <div className="mb-3 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-mp-soft-blue via-mp-panel to-mp-warm text-4xl">
                  {cat.emoji}
                </div>
                <p className="mb-1 text-[11px] uppercase tracking-[0.14em] text-mp-muted">Category</p>
                <h3 className="text-base font-semibold text-mp-charcoal">{cat.title}</h3>
                <div className="mt-4 border-t border-mp-border pt-3">
                  <Link href="/customer/browse" className="text-sm font-medium text-mp-accent hover:text-mp-charcoal">
                    Browse {cat.title.toLowerCase()}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 max-w-2xl text-center md:mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">How it works</p>
          <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal sm:text-3xl">A simpler way to plan in four steps</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-[22px] border border-mp-border bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      index === 0 ? "bg-mp-charcoal text-mp-panel" : "bg-mp-accent-soft text-mp-accent"
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-semibold text-mp-muted">0{index + 1}</span>
                </div>
                <h3 className="text-base font-semibold text-mp-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mp-muted">{step.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="about" className="bg-mp-accent py-10 text-mp-panel">
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
                  <div className="mb-3 inline-flex rounded-xl bg-mp-accent-soft/20 p-2 text-mp-panel">
                    <Icon className="size-4.5" />
                  </div>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mp-accent-soft">{item.copy}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[28px] border border-mp-border bg-gradient-to-r from-mp-panel via-mp-card to-mp-soft-blue px-6 py-7 shadow-[var(--shadow-mp-card)] md:px-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mp-accent">For vendors and professionals</p>
              <h2 className="mt-2 text-2xl font-semibold text-mp-charcoal">Grow your event business with a cleaner workflow.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-mp-muted">
                Create listings, respond to inquiries, and manage bookings from a single dashboard that feels easier to use.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[220px]">
              <Link
                href="/register"
                className="rounded-full bg-mp-charcoal px-4 py-2.5 text-center text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
              >
                Register as a vendor
              </Link>
              <Link
                href="/vendor"
                className="rounded-full border border-mp-border bg-mp-card px-4 py-2.5 text-center text-sm font-medium text-mp-charcoal transition-colors hover:border-mp-accent/40 hover:bg-mp-soft-blue"
              >
                Open vendor area
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-mp-border bg-mp-charcoal text-mp-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center">
              <div className="overflow-hidden rounded-full border border-mp-accent-soft/20 bg-mp-card shadow-sm">
                <Image
                  src={logoImage}
                  alt="MyPlanzo logo"
                  width={52}
                  height={52}
                  className="h-12 w-12 object-cover"
                  style={{ objectPosition: "center 35%" }}
                />
              </div>
              {/* My<span className="text-mp-accent-soft">Planzo</span> */}
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-mp-accent-soft">
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-mp-accent-soft/20 bg-mp-accent/20 text-mp-panel transition-colors hover:bg-mp-accent"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-mp-accent-soft">{group.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-mp-accent-soft">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="transition-colors hover:text-mp-panel">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-mp-accent-soft/15">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs text-mp-accent-soft md:flex-row md:items-center md:justify-between">
            <span>© 2026 MyPlanzo. All rights reserved.</span>
            <span>Designed for calmer event planning.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
