import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { EventBookings } from "./EventBookings";
import { DeleteEventButton } from "./DeleteEventButton";

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  const { id } = await params;
  if (!session || session.role !== "CUSTOMER") {
    redirect(`/login?next=/customer/events/${id}`);
  }

  const event = await prisma.event.findFirst({
    where: { id, customerId: session.sub },
  });
  if (!event) notFound();

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.sub, OR: [{ eventId: id }, { eventId: null }] },
    include: { vendor: { select: { businessName: true } } },
    orderBy: { createdAt: "desc" },
  });

  const toRow = (b: (typeof bookings)[number]) => ({
    id: b.id,
    label: b.vendor.businessName,
    status: b.status,
  });
  const linked = bookings.filter((b) => b.eventId === id).map(toRow);
  const unlinked = bookings.filter((b) => b.eventId === null).map(toRow);

  return (
    <div className="space-y-6">
      <Link href="/customer/events" className="text-sm underline">
        ← My Events
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-mp-charcoal">{event.name}</h1>
          <p className="text-sm text-mp-muted mt-1">
            {event.eventType ? `${event.eventType} · ` : ""}
            {event.eventDate ? DATE_FMT.format(event.eventDate) : "Date to be decided"}
          </p>
        </div>
        <DeleteEventButton eventId={event.id} />
      </div>

      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h2 className="mb-4 text-sm font-semibold text-mp-charcoal">Vendors &amp; bookings</h2>
        <EventBookings eventId={event.id} linked={linked} unlinked={unlinked} />
      </div>
    </div>
  );
}
