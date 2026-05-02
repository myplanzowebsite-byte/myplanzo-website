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
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Bookings</h1>
      <ul className="space-y-2">
        {bookings.map((b) => (
          <li key={b.id}>
            <Link
              href={`/customer/bookings/${b.id}`}
              className="block rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
            >
              <div className="flex justify-between gap-2">
                <span className="font-medium">{b.vendor.businessName}</span>
                <span className="text-xs text-mp-muted">{b.status}</span>
              </div>
              <p className="text-sm text-mp-muted mt-1 line-clamp-2">{b.eventDetails}</p>
            </Link>
          </li>
        ))}
        {bookings.length === 0 ? <p className="text-mp-muted text-sm">No bookings yet.</p> : null}
      </ul>
    </div>
  );
}
