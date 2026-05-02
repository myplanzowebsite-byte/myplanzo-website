import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCmsAnnouncementsPage() {
  const rows = await prisma.cmsAnnouncement.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <>
      <AdminHeader title="CMS — Announcements" breadcrumbs={["Manage CMS", "Announcements"]} />
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]"
          >
            <p className="font-medium">{r.title}</p>
            <p className="text-mp-muted mt-1">{r.body}</p>
          </li>
        ))}
        {rows.length === 0 ? <p className="text-mp-muted">No announcements.</p> : null}
      </ul>
    </>
  );
}
