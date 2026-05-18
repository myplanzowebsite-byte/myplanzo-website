import { AdminHeader } from "@/components/admin/AdminHeader";
import { prisma } from "@/lib/prisma";
import { SupportToggle } from "@/components/admin/SupportToggle";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function AdminSupportPage() {
  const messages = await prisma.supportMessage.findMany({
    orderBy: [{ handled: "asc" }, { createdAt: "desc" }],
    take: 200,
  });
  const openCount = messages.filter((m) => !m.handled).length;

  return (
    <>
      <AdminHeader
        title="Support inbox"
        breadcrumbs={["Support"]}
        subtitle={`${openCount} open · ${messages.length} total`}
      />
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-[var(--radius-mp-card)] p-5 shadow-[var(--shadow-mp-card)] ${
              m.handled ? "bg-mp-card opacity-70" : "bg-mp-card"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-mp-charcoal">{m.subject}</p>
                <p className="text-xs text-mp-muted">
                  {m.name} · {m.email} · {DATE_FMT.format(m.createdAt)}
                </p>
              </div>
              <SupportToggle id={m.id} handled={m.handled} />
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-mp-charcoal">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-8 text-center text-sm text-mp-muted shadow-[var(--shadow-mp-card)]">
            No support messages.
          </div>
        )}
      </div>
    </>
  );
}
