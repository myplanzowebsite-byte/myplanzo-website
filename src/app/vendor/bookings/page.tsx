import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { VendorBookingRow } from "@/components/vendor/VendorBookingRow";

export default async function VendorBookingsPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login");
  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { vendorId: vendor.id },
    include: { customer: { select: { email: true } }, payments: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Bookings</h1>
      <div className="space-y-2">
        {bookings.map((b) => (
          <VendorBookingRow key={b.id} booking={b} />
        ))}
        {bookings.length === 0 ? <p className="text-mp-muted text-sm">No bookings yet.</p> : null}
      </div>
    </div>
  );
}
