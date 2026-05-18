import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function VendorMessagesPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login?next=/vendor/messages");

  const vendor = await prisma.vendorProfile.findUnique({ where: { userId: session.sub } });
  if (!vendor) redirect("/vendor");

  const bookings = await prisma.booking.findMany({
    where: { vendorId: vendor.id, messages: { some: {} } },
    include: {
      customer: { select: { customerProfile: { select: { displayName: true } } } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { receiverId: session.sub, readAt: null } } } },
    },
  });

  const convos = bookings.sort(
    (a, b) =>
      (b.messages[0]?.createdAt.getTime() ?? 0) - (a.messages[0]?.createdAt.getTime() ?? 0),
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Messages</h1>

      <ul className="space-y-3">
        {convos.map((b) => (
          <li key={b.id}>
            <Link
              href={`/vendor/messages/${b.id}`}
              className="block rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)] hover:ring-2 ring-mp-charcoal/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium text-mp-charcoal">
                  {b.customer.customerProfile?.displayName || "Customer"}
                </span>
                {b._count.messages > 0 && (
                  <span className="rounded-full bg-mp-accent px-2 py-0.5 text-[10px] font-semibold text-white">
                    {b._count.messages} new
                  </span>
                )}
              </div>
              <p className="mt-1 truncate text-sm text-mp-muted">
                {b.messages[0]?.body ?? "No messages yet."}
              </p>
            </Link>
          </li>
        ))}
        {convos.length === 0 && (
          <p className="text-sm text-mp-muted">No conversations yet.</p>
        )}
      </ul>
    </div>
  );
}
