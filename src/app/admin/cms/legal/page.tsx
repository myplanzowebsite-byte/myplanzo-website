import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCmsLegalPage() {
  const pages = await prisma.cmsPage.findMany({ where: { slug: { in: ["privacy", "terms"] } } });
  const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));
  return (
    <>
      <AdminHeader title="CMS — Legal" breadcrumbs={["Manage CMS", "Legal"]} />
      <div className="grid gap-4 lg:grid-cols-2">
        {(["privacy", "terms"] as const).map((slug) => (
          <div
            key={slug}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm"
          >
            <p className="font-semibold capitalize">{slug}</p>
            <p className="text-mp-muted mt-2 whitespace-pre-wrap">
              {bySlug[slug]?.bodyHtml || "—"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
