import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { DisputeResolveForm } from "@/components/admin/DisputeResolveForm";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_STYLE: Record<string, string> = {
  OPEN: "bg-mp-warm text-mp-charcoal",
  RESOLVED: "bg-green-500/15 text-green-700",
  REJECTED: "bg-mp-accent-soft text-mp-accent",
};

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      raisedBy: { select: { email: true } },
      booking: {
        select: {
          id: true,
          status: true,
          vendor: { select: { businessName: true } },
        },
      },
    },
  });

  const openCount = disputes.filter((d) => d.status === "OPEN").length;

  return (
    <>
      <AdminHeader
        title="Disputes"
        breadcrumbs={["Disputes"]}
        subtitle={`${openCount} open · ${disputes.length} total`}
      />
      <div className="space-y-3">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="rounded-[var(--radius-mp-card)] bg-mp-card p-5 shadow-[var(--shadow-mp-card)]"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-mp-charcoal">
                  {d.booking.vendor.businessName}
                </p>
                <p className="text-xs text-mp-muted">
                  Raised by {d.raisedBy.email} · {DATE_FMT.format(d.createdAt)} · booking{" "}
                  {d.booking.status}
                </p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  STATUS_STYLE[d.status]
                }`}
              >
                {d.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-mp-charcoal">{d.reason}</p>

            {d.status === "OPEN" ? (
              <DisputeResolveForm disputeId={d.id} />
            ) : (
              d.resolution && (
                <p className="mt-2 rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-xs text-mp-charcoal">
                  <span className="font-medium">Resolution:</span> {d.resolution}
                </p>
              )
            )}
          </div>
        ))}
        {disputes.length === 0 && (
          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-8 text-center text-sm text-mp-muted shadow-[var(--shadow-mp-card)]">
            No disputes raised.
          </div>
        )}
      </div>
    </>
  );
}
