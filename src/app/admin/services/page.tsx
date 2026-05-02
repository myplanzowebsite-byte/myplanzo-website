import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminServicesPage() {
  const listings = await prisma.serviceListing.findMany({
    include: { vendor: true },
    orderBy: { updatedAt: "desc" },
    take: 80,
  });

  return (
    <>
      <AdminHeader title="Manage Services" breadcrumbs={["Manage Services"]} />
      <div className="overflow-hidden rounded-[var(--radius-mp-card)] bg-mp-card shadow-[var(--shadow-mp-card)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mp-border bg-mp-panel/40 text-mp-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Vendor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-b border-mp-border/80">
                <td className="px-4 py-3 font-medium">{l.title}</td>
                <td className="px-4 py-3">{l.vendor.businessName}</td>
                <td className="px-4 py-3">{l.status}</td>
                <td className="px-4 py-3 text-mp-muted">{l.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
            {listings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-mp-muted">
                  No listings.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </>
  );
}
