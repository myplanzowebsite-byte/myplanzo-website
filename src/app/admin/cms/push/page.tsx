import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCmsPushPage() {
  const rows = await prisma.pushNotificationCampaign.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <AdminHeader title="CMS — Push notifications" breadcrumbs={["Manage CMS", "Push"]} />
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
            <p className="font-medium">{r.title}</p>
            <p className="text-mp-muted mt-1">{r.body}</p>
          </li>
        ))}
        {rows.length === 0 ? <p className="text-mp-muted">No campaigns.</p> : null}
      </ul>
    </>
  );
}
