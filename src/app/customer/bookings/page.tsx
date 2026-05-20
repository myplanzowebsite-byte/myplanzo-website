import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function CustomerBookingsPage() {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.sub },
    include: { vendor: true, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Bookings</h1>
      <ul className="space-y-3">
        {bookings.map((b) => (
          <li key={b.id}>
            <Link
              href={`/customer/bookings/${b.id}`}
              className="block rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
            >
              <div className="flex justify-between gap-3">
                <span className="font-medium">{b.vendor.businessName}</span>
                <span className="text-xs text-mp-muted shrink-0">{b.status}</span>
              </div>
              <p className="text-sm text-mp-muted mt-2 line-clamp-2">{b.eventDetails}</p>
            </Link>
          </li>
        ))}
        {bookings.length === 0 ? (
          <div className="rounded-[var(--radius-mp-card)] border border-dashed border-mp-border bg-mp-card p-8 text-center">
            <div className="text-3xl">🎉</div>
            <p className="mt-2 text-sm font-medium text-mp-charcoal">
              Once a vendor agrees to your quote, it will appear here.
            </p>
            <p className="mt-1 text-xs text-mp-muted">
              Browse vendors, send an enquiry, and accept a quote to get your first booking rolling.
            </p>
            <Link
              href="/browse"
              className="mt-4 inline-block rounded-md bg-mp-charcoal px-4 py-2 text-xs font-medium text-mp-panel transition-colors hover:bg-mp-accent"
            >
              Browse vendors
            </Link>
          </div>
        ) : null}
      </ul>
    </div>
  );
}
