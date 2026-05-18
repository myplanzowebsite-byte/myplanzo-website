import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { ToggleBlockButton } from "@/components/admin/ToggleBlockButton";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const inr = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findFirst({
    where: { id, role: "CUSTOMER" },
    include: {
      customerProfile: true,
      bookingsAsCustomer: {
        include: { vendor: true, payments: true },
        orderBy: { createdAt: "desc" },
      },
      disputesRaised: {
        include: { booking: { select: { vendor: { select: { businessName: true } } } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { sentMessages: true } },
    },
  });
  if (!user) notFound();

  const payments = user.bookingsAsCustomer.flatMap((b) =>
    b.payments.map((p) => ({ ...p, vendorName: b.vendor.businessName })),
  );

  return (
    <>
      <AdminHeader
        title={user.customerProfile?.displayName ?? user.email}
        breadcrumbs={["Manage Users", "Customers", "View"]}
        subtitle={user.email}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-[var(--radius-mp-card)] bg-mp-card p-5 text-sm shadow-[var(--shadow-mp-card)]">
          <div>
            <p className="text-xs text-mp-muted">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-xs text-mp-muted">Status</p>
            <p className="font-medium">
              {user.deletedAt ? "Deleted" : user.isBlocked ? "Blocked" : "Active"}
            </p>
          </div>
          <div>
            <p className="text-xs text-mp-muted">Messages sent</p>
            <p className="font-medium">{user._count.sentMessages}</p>
          </div>
          <ToggleBlockButton userId={user.id} blocked={user.isBlocked} />
          <Link href="/admin/users/customers" className="block text-sm text-mp-charcoal underline">
            ← Back to list
          </Link>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-3 text-sm font-semibold text-mp-charcoal">
              Booking history ({user.bookingsAsCustomer.length})
            </h3>
            <ul className="space-y-2 text-sm">
              {user.bookingsAsCustomer.map((b) => (
                <li key={b.id} className="flex justify-between border-b border-mp-border/60 py-2">
                  <span>{b.vendor.businessName}</span>
                  <span className="text-mp-muted">
                    {DATE_FMT.format(b.createdAt)} · {b.status}
                  </span>
                </li>
              ))}
              {user.bookingsAsCustomer.length === 0 && <li className="text-mp-muted">No bookings</li>}
            </ul>
          </div>

          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-3 text-sm font-semibold text-mp-charcoal">
              Payment history ({payments.length})
            </h3>
            <ul className="space-y-2 text-sm">
              {payments.map((p) => (
                <li key={p.id} className="flex justify-between border-b border-mp-border/60 py-2">
                  <span>{p.vendorName}</span>
                  <span className="text-mp-muted">
                    {inr(p.amountPaise)} · {p.status}
                  </span>
                </li>
              ))}
              {payments.length === 0 && <li className="text-mp-muted">No payments</li>}
            </ul>
          </div>

          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]">
            <h3 className="mb-3 text-sm font-semibold text-mp-charcoal">
              Disputes ({user.disputesRaised.length})
            </h3>
            <ul className="space-y-2 text-sm">
              {user.disputesRaised.map((d) => (
                <li key={d.id} className="border-b border-mp-border/60 py-2">
                  <p className="flex justify-between">
                    <span>{d.booking.vendor.businessName}</span>
                    <span className="text-mp-muted">{d.status}</span>
                  </p>
                  <p className="text-xs text-mp-muted">{d.reason}</p>
                </li>
              ))}
              {user.disputesRaised.length === 0 && <li className="text-mp-muted">No disputes</li>}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
