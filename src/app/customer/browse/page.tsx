import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function CustomerBrowsePage({
  searchParams,
}: {
  searchParams?: { event?: string };
}) {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");
  const eventTypes = await prisma.eventType.findMany({ orderBy: { sortOrder: "asc" } });
  const selectedEvent = await searchParams?.event;

  const listings = await prisma.serviceListing.findMany({
    where: {
      status: "ACTIVE",
      vendor: { verificationStatus: "ACTIVE" },
      ...(selectedEvent ? { eventTags: { has: selectedEvent } } : {}),
    },
    include: { vendor: true },
    orderBy: { updatedAt: "desc" },
    take: 40,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">Browse vendors</h1>
          <p className="text-sm text-mp-muted">Select the event type and find the right vendor in minutes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/customer/browse"
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              !selectedEvent
                ? "bg-mp-charcoal text-mp-panel border-mp-charcoal"
                : "bg-mp-card text-mp-charcoal border-mp-border"
            }`}
          >
            All
          </Link>
          {eventTypes.map((eventType) => (
            <Link
              key={eventType.id}
              href={`/customer/browse?event=${encodeURIComponent(eventType.title)}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                selectedEvent === eventType.title
                  ? "bg-mp-charcoal text-mp-panel border-mp-charcoal"
                  : "bg-mp-card text-mp-charcoal border-mp-border"
              }`}
            >
              {eventType.emoji} {eventType.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {listings.map((l) => (
          <Link
            key={l.id}
            href={`/customer/listings/${l.id}`}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
          >
            <div className="mb-3 h-44 overflow-hidden rounded-3xl bg-mp-soft-blue">
              {l.photos?.[0] ? (
                <img src={l.photos[0]} alt={l.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">🎉</div>
              )}
            </div>
            <p className="font-medium text-mp-charcoal">{l.title}</p>
            <p className="text-xs text-mp-muted mt-1">{l.vendor.businessName}</p>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-mp-muted">
              <span>{l.priceMin ? `₹${l.priceMin.toLocaleString()}+` : "Contact for pricing"}</span>
              <span>{l.location || "Mumbai"}</span>
            </div>
            <p className="text-sm text-mp-muted mt-2 line-clamp-2">{l.description}</p>
          </Link>
        ))}
        {listings.length === 0 ? (
          <p className="text-mp-muted text-sm">No active listings yet.</p>
        ) : null}
      </div>
    </div>
  );
}
