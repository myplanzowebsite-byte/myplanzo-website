import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { BookingChat } from "@/components/customer/BookingChat";
import { QuotePanel } from "@/components/QuotePanel";

export default async function CustomerMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  const { id } = await params;
  if (!session || session.role !== "CUSTOMER") {
    redirect(`/login?next=/customer/messages/${id}`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id, customerId: session.sub },
    include: { vendor: { select: { businessName: true } } },
  });
  if (!booking) notFound();

  // Mark messages addressed to this customer as read on open.
  await prisma.message.updateMany({
    where: { bookingId: id, receiverId: session.sub, readAt: null },
    data: { readAt: new Date() },
  });

  return (
    <div className="space-y-4">
      <Link href="/customer/messages" className="text-sm underline">
        ← All messages
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-mp-charcoal">{booking.vendor.businessName}</h1>
        <Link href={`/customer/bookings/${id}`} className="text-sm text-mp-accent underline">
          View booking →
        </Link>
      </div>
      <QuotePanel bookingId={booking.id} role="CUSTOMER" bookingStatus={booking.status} />
      <BookingChat bookingId={booking.id} currentUserId={session.sub} />
    </div>
  );
}
