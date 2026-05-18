import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { BookingChat } from "@/components/customer/BookingChat";
import { QuotePanel } from "@/components/QuotePanel";

export default async function VendorMessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await readSession();
  const { id } = await params;
  if (!session || session.role !== "VENDOR") {
    redirect(`/login?next=/vendor/messages/${id}`);
  }

  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) redirect("/vendor");

  const booking = await prisma.booking.findFirst({
    where: { id, vendorId: vendor.id },
    include: { customer: { select: { customerProfile: { select: { displayName: true } } } } },
  });
  if (!booking) notFound();

  await prisma.message.updateMany({
    where: { bookingId: id, receiverId: session.sub, readAt: null },
    data: { readAt: new Date() },
  });

  return (
    <div className="space-y-4">
      <Link href="/vendor/messages" className="text-sm underline">
        ← All messages
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-mp-charcoal">
          {booking.customer.customerProfile?.displayName || "Customer"}
        </h1>
        <Link href="/vendor/bookings" className="text-sm text-mp-accent underline">
          View bookings →
        </Link>
      </div>
      <QuotePanel bookingId={booking.id} role="VENDOR" bookingStatus={booking.status} />
      <BookingChat bookingId={booking.id} currentUserId={session.sub} />
    </div>
  );
}
