import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { Eye, CheckCircle2 } from "lucide-react";

export default async function AdminCustomersPage() {
  const rows = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { customerProfile: true, bookingsAsCustomer: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <AdminHeader
        title="Customers"
        breadcrumbs={["Manage Users", "Customers"]}
      />
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">SR No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={u.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">
                  {u.customerProfile?.displayName ?? "—"}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full ${u.isBlocked ? "bg-mp-charcoal" : "bg-mp-border"}`}
                    />
                    {u.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">{u.bookingsAsCustomer.length}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/customers/${u.id}`}
                    className="inline-flex items-center gap-1 text-mp-charcoal hover:underline"
                  >
                    <Eye className="size-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-mp-muted" colSpan={7}>
                  No customers yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-mp-border px-4 py-3 text-xs text-mp-muted">
          <span>Showing {rows.length} entries</span>
          <span className="flex gap-2">
            <CheckCircle2 className="size-4 opacity-40" />
          </span>
        </div>
      </div>
    </>
  );
}
