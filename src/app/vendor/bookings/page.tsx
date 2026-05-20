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
        {bookings.length === 0 ? (
          <div className="rounded-[var(--radius-mp-card)] border border-dashed border-mp-border bg-mp-card p-8 text-center">
            <div className="text-3xl">📅</div>
            <p className="mt-2 text-sm font-medium text-mp-charcoal">
              Once a customer books you, it will appear here.
            </p>
            <p className="mt-1 text-xs text-mp-muted">
              Tip — keep your listings active and your availability calendar up to date so customers can find you.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
