import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminSubadminsPage() {
  const subs = await prisma.user.findMany({
    where: { role: "SUBADMIN" },
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <AdminHeader title="Manage Sub Admin" breadcrumbs={["Manage Sub Admin"]} />
      <div className="mb-4">
        <Link
          href="/admin/subadmins/new"
          className="inline-block rounded-md bg-mp-charcoal px-4 py-2 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
        >
          Create subadmin
        </Link>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((u) => (
              <tr key={u.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
              </tr>
            ))}
            {subs.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-mp-muted">
                  No subadmins — create via{" "}
                  <Link href="/admin/subadmins/new" className="underline">
                    new
                  </Link>{" "}
                  or seed.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
