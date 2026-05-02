import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";

export default async function AdminCmsFaqPage() {
  const faqs = await prisma.cmsFaq.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <>
      <AdminHeader title="CMS — FAQ" breadcrumbs={["Manage CMS", "FAQ"]} />
      <ul className="space-y-2 rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] text-sm">
        {faqs.map((f) => (
          <li key={f.id} className="border-b border-mp-border/60 pb-2">
            <p className="font-medium">{f.question}</p>
            <p className="text-mp-muted mt-1">{f.answer}</p>
          </li>
        ))}
        {faqs.length === 0 ? (
          <li className="text-mp-muted">No FAQ rows — add via Prisma Studio or seed.</li>
        ) : null}
      </ul>
    </>
  );
}
