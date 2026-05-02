import Link from "next/link";

export const dynamic = "force-dynamic";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mp-canvas">
      <header className="border-b border-mp-border bg-mp-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/vendor" className="font-semibold text-mp-charcoal">
            MyPlanzo — Vendor
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/vendor/listings"
              className="rounded-full px-3 py-1.5 text-mp-muted transition-colors hover:bg-mp-accent-soft hover:text-mp-charcoal"
            >
              Listings
            </Link>
            <Link
              href="/vendor/bookings"
              className="rounded-full px-3 py-1.5 text-mp-muted transition-colors hover:bg-mp-accent-soft hover:text-mp-charcoal"
            >
              Bookings
            </Link>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="rounded-full px-3 py-1.5 font-medium text-mp-logout transition-colors hover:bg-mp-accent-soft"
              >
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
