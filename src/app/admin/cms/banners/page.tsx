import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCmsBannersPage() {
  const banners = await prisma.cmsBanner.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <AdminHeader title="CMS — Banners" breadcrumbs={["Manage CMS", "Banners"]} />
      <ul className="space-y-2 text-sm">
        {banners.map((b) => (
          <li
            key={b.id}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
          >
            {b.imageUrl} — {b.active ? "active" : "inactive"}
          </li>
        ))}
        {banners.length === 0 ? <p className="text-mp-muted">No banners.</p> : null}
      </ul>
    </>
  );
}
