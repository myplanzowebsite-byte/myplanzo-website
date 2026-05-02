import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { ToggleBlockButton } from "@/components/admin/ToggleBlockButton";

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
      bookingsAsCustomer: { include: { vendor: true, listing: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) notFound();

  return (
    <>
      <AdminHeader
        title={user.customerProfile?.displayName ?? user.email}
        breadcrumbs={["Manage Users", "Customers", "View"]}
        subtitle={user.email}
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)] lg:col-span-1 space-y-3 text-sm">
          <div>
            <p className="text-mp-muted text-xs">Phone</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-mp-muted text-xs">Status</p>
            <p className="font-medium">{user.isBlocked ? "Blocked" : "Active"}</p>
          </div>
          <ToggleBlockButton userId={user.id} blocked={user.isBlocked} />
          <Link href="/admin/users/customers" className="text-sm text-mp-charcoal underline">
            ← Back to list
          </Link>
        </div>
        <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)] lg:col-span-2">
          <h3 className="text-sm font-semibold text-mp-charcoal mb-3">Bookings</h3>
          <ul className="space-y-2 text-sm">
            {user.bookingsAsCustomer.map((b) => (
              <li key={b.id} className="flex justify-between border-b border-mp-border/60 py-2">
                <span>{b.vendor.businessName}</span>
                <span className="text-mp-muted">{b.status}</span>
              </li>
            ))}
            {user.bookingsAsCustomer.length === 0 ? (
              <li className="text-mp-muted">No bookings</li>
            ) : null}
          </ul>
        </div>
      </div>
    </>
  );
}
