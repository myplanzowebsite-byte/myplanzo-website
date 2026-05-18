import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { readSession } from "@/lib/auth/session";
import { MonthCalendar } from "@/components/MonthCalendar";
import { EarningsSummary, type EarningsPayment } from "@/components/vendor/EarningsSummary";
import { OnboardingTour } from "@/components/OnboardingTour";

const VENDOR_TOUR = [
  {
    title: "Welcome to MyPlanzo",
    body: "This is your vendor dashboard — bookings, earnings and performance at a glance.",
  },
  {
    title: "Create listings",
    body: "Add service listings with photos and pricing so customers can discover you.",
  },
  {
    title: "Send quotes",
    body: "When a customer enquires, open the message thread and send them a quote to confirm the booking.",
  },
  {
    title: "Earnings & payouts",
    body: "Track gross earnings, commission and net payouts here, and download monthly statements.",
  },
];

export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const MONTH_LABEL = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" });

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
      <p className="text-xs text-mp-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-mp-charcoal">{value}</p>
    </div>
  );
}

export default async function VendorDashboardPage() {
  const session = await readSession();
  if (!session || session.role !== "VENDOR") redirect("/login?next=/vendor");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.sub },
    include: {
      listings: { select: { id: true } },
      bookings: {
        include: {
          listing: { select: { category: true } },
          payments: {
            select: { status: true, amountPaise: true, commissionPaise: true, createdAt: true },
          },
        },
      },
    },
  });
  if (!vendor) redirect("/login");

  const shortlistCount = await prisma.shortlistEntry.count({
    where: { listing: { vendorId: vendor.id } },
  });

  const bookings = vendor.bookings;
  const count = (s: string) => bookings.filter((b) => b.status === s).length;
  const confirmedish = count("CONFIRMED") + count("COMPLETED");
  const conversion =
    vendor.profileViews > 0
      ? `${Math.round((confirmedish / vendor.profileViews) * 100)}%`
      : "—";

  const payments: EarningsPayment[] = bookings.flatMap((b) =>
    b.payments.map((p) => ({
      status: p.status,
      amountPaise: p.amountPaise,
      commissionPaise: p.commissionPaise,
      createdAt: p.createdAt,
      category: b.listing?.category ?? null,
    })),
  );

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const upcoming = bookings
    .filter(
      (b) =>
        b.eventDate &&
        b.eventDate >= startOfToday &&
        (b.status === "PENDING" || b.status === "CONFIRMED"),
    )
    .sort((a, b) => a.eventDate!.getTime() - b.eventDate!.getTime());

  // Last 3 months for statement links.
  const now = new Date();
  const statementMonths = [0, 1, 2].map((i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return {
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: MONTH_LABEL.format(d),
    };
  });

  return (
    <div className="space-y-6">
      <OnboardingTour tourId="mp_tour_vendor" steps={VENDOR_TOUR} />
      <h1 className="text-2xl font-semibold text-mp-charcoal">Vendor dashboard</h1>

      {vendor.verificationStatus !== "ACTIVE" && (
        <p className="rounded-md border border-mp-border bg-mp-warm px-4 py-3 text-sm text-mp-charcoal">
          Your profile is <strong>{vendor.verificationStatus}</strong>. An admin must approve it
          before your listings appear publicly.
        </p>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Listings" value={String(vendor.listings.length)} />
        <StatCard label="Bookings" value={String(bookings.length)} />
        <StatCard label="Shortlisted by" value={String(shortlistCount)} />
        <StatCard label="Profile views" value={String(vendor.profileViews)} />
        <StatCard label="Conversion" value={conversion} />
      </div>

      {/* Earnings — on the dashboard itself */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-mp-muted">
          Earnings &amp; payouts
        </h2>
        <EarningsSummary payments={payments} />
      </div>

      {/* Statements */}
      <section className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h2 className="text-sm font-semibold text-mp-charcoal">Monthly statements</h2>
        <p className="text-xs text-mp-muted">Open a month and use Print / Save as PDF.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {statementMonths.map((m) => (
            <Link
              key={m.key}
              href={`/vendor/statements/${m.key}`}
              className="rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:border-mp-accent"
            >
              {m.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Payout setup — client-blocked on Razorpay Route activation */}
      <section className="rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h2 className="text-sm font-semibold text-mp-charcoal">Payout account</h2>
        <p className="mt-1 text-xs text-mp-muted">
          Bank / UPI payouts are settled by Razorpay — your account details are held by Razorpay,
          never stored on MyPlanzo. Payout account linking opens once Razorpay Route is activated
          for the platform.
        </p>
        <button
          disabled
          className="mt-3 cursor-not-allowed rounded-md border border-mp-border px-4 py-2 text-sm text-mp-muted opacity-60"
        >
          Link payout account (coming soon)
        </button>
      </section>

      {/* Upcoming bookings calendar */}
      <section className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h2 className="mb-3 text-sm font-semibold text-mp-charcoal">Upcoming bookings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <MonthCalendar
            blockedDates={[]}
            highlightDates={upcoming.map((b) => b.eventDate!.toISOString().slice(0, 10))}
            highlightLabel="Booking"
          />
          <ul className="space-y-2 text-sm">
            {upcoming.slice(0, 6).map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between rounded-md border border-mp-border bg-mp-panel px-3 py-2"
              >
                <span className="text-mp-charcoal">{DATE_FMT.format(b.eventDate!)}</span>
                <span className="text-xs text-mp-muted">{b.status}</span>
              </li>
            ))}
            {upcoming.length === 0 && (
              <li className="text-mp-muted">No dated upcoming bookings.</li>
            )}
          </ul>
        </div>
      </section>

      <div className="flex gap-3 text-sm">
        <Link href="/vendor/listings" className="font-medium text-mp-charcoal underline">
          Manage listings →
        </Link>
        <Link href="/vendor/bookings" className="font-medium text-mp-charcoal underline">
          View bookings →
        </Link>
      </div>
    </div>
  );
}
