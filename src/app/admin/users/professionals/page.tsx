import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { Eye } from "lucide-react";

export default async function AdminProfessionalsPage() {
  const rows = await prisma.user.findMany({
    where: { role: "VENDOR" },
    include: { vendorProfile: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <>
      <AdminHeader title="Professionals" breadcrumbs={["Manage Users", "Professionals"]} />
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">SR No.</th>
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u, i) => (
              <tr key={u.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{u.vendorProfile?.businessName ?? "—"}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.phone}</td>
                <td className="px-4 py-3">{u.vendorProfile?.verificationStatus ?? "—"}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/professionals/${u.id}`}
                    className="inline-flex items-center gap-1 text-mp-charcoal hover:underline"
                  >
                    <Eye className="size-4" /> View
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-mp-muted" colSpan={6}>
                  No professionals yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
