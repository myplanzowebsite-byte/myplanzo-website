import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { CreateEventForm } from "./CreateEventForm";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

type EventRow = Awaited<ReturnType<typeof loadEvents>>[number];

async function loadEvents(customerId: string) {
  return prisma.event.findMany({
    where: { customerId },
    include: { bookings: { include: { vendor: { select: { businessName: true } } } } },
    orderBy: { eventDate: "asc" },
  });
}

function EventCard({ event }: { event: EventRow }) {
  const vendors = [...new Set(event.bookings.map((b) => b.vendor.businessName))];
  return (
    <Link
      href={`/customer/events/${event.id}`}
      className="block rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-mp-charcoal">{event.name}</span>
        <span className="shrink-0 text-xs text-mp-muted">
          {event.eventDate ? DATE_FMT.format(event.eventDate) : "Date TBD"}
        </span>
      </div>
      {event.eventType && (
        <p className="mt-0.5 text-xs uppercase tracking-wide text-mp-steel">{event.eventType}</p>
      )}
      <p className="mt-2 text-sm text-mp-muted">
        {vendors.length > 0
          ? `${event.bookings.length} booking${event.bookings.length > 1 ? "s" : ""} · ${vendors.join(", ")}`
          : "No vendors linked yet"}
      </p>
    </Link>
  );
}

export default async function CustomerEventsPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login?next=/customer/events");

  const events = await loadEvents(session.sub);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const upcoming = events.filter((e) => !e.eventDate || e.eventDate >= startOfToday);
  const past = events.filter((e) => e.eventDate && e.eventDate < startOfToday);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">My Events</h1>
          <p className="text-sm text-mp-muted mt-1">
            Group your bookings under an event to see every vendor in one place.
          </p>
        </div>
      </div>

      <CreateEventForm />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-mp-charcoal">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-mp-muted">No upcoming events.</p>
        ) : (
          upcoming.map((e) => <EventCard key={e.id} event={e} />)
        )}
      </section>

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-mp-charcoal">Past</h2>
          {past.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </section>
      )}
    </div>
  );
}
