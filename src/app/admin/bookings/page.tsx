import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      customer: { select: { email: true } },
      vendor: true,
      payments: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <>
      <AdminHeader title="Bookings & Transactions" breadcrumbs={["Bookings"]} />
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3">{b.customer.email}</td>
                <td className="px-4 py-3">{b.vendor.businessName}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3">₹{(b.amountPaise / 100).toFixed(2)}</td>
              </tr>
            ))}
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-mp-muted">
                  No bookings.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-mp-muted">
        Disputes and admin overrides are managed under{" "}
        <a href="/admin/disputes" className="underline">Disputes</a>.
      </p>
    </>
  );
}
