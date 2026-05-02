import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { BookingActions } from "@/components/customer/BookingActions";
import { BookingChat } from "@/components/customer/BookingChat";
import { ChecklistSection } from "@/components/customer/ChecklistSection";

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  if (!session || session.role !== "CUSTOMER") redirect("/login");
  const { id } = await params;
  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { vendor: true, payments: true },
  });
  if (!booking) notFound();

  return (
    <div className="space-y-6">
      <Link href="/customer/bookings" className="text-sm underline">
        ← Bookings
      </Link>
      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)] space-y-2">
        <div className="flex flex-wrap justify-between gap-2">
          <h1 className="text-xl font-semibold">{booking.vendor.businessName}</h1>
          <span className="text-sm text-mp-muted">{booking.status}</span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{booking.eventDetails}</p>
        <p className="text-sm text-mp-muted">
          Amount: ₹{(booking.amountPaise / 100).toFixed(2)}
        </p>
        <BookingActions bookingId={booking.id} status={booking.status} />
      </div>
      <ChecklistSection bookingId={booking.id} />
      <BookingChat bookingId={booking.id} />
    </div>
  );
}
