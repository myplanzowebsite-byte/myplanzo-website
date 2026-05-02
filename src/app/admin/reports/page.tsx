import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminReportsPage() {
  return (
    <>
      <AdminHeader title="Reports & Analytics" breadcrumbs={["Reports"]} />
      <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-8 shadow-[var(--shadow-mp-card)] text-center text-sm text-mp-muted">
        Chart placeholders — connect aggregates from Prisma (bookings by month, category, city) to match
        Reports &amp; Analytics PNGs.
      </div>
    </>
  );
}
