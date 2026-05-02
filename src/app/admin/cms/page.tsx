import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";

const links = [
  { href: "/admin/cms/faq", label: "FAQ" },
  { href: "/admin/cms/banners", label: "Banners" },
  { href: "/admin/cms/announcements", label: "Announcements" },
  { href: "/admin/cms/push", label: "Push notifications" },
  { href: "/admin/cms/legal", label: "Privacy and Terms" },
];

export default function AdminCmsHubPage() {
  return (
    <>
      <AdminHeader title="Manage CMS" breadcrumbs={["Manage CMS"]} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)] text-sm font-medium hover:ring-2 ring-mp-charcoal/10"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-xs text-mp-muted max-w-xl">
        CMS CRUD can be expanded per client scope; routes match UIUX PNG structure.
      </p>
    </>
  );
}
