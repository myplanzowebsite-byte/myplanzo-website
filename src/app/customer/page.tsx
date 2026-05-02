import Link from "next/link";

export default function CustomerHomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-mp-charcoal">Customer home</h1>
      <p className="text-mp-muted text-sm max-w-xl">
        Discover vendors for birthdays, showers, and small events. UI follows admin design tokens until
        dedicated marketplace PNGs are added.
      </p>
      <Link
        href="/customer/browse"
        className="inline-block rounded-md bg-mp-charcoal px-5 py-2.5 text-sm font-medium text-mp-panel transition-colors hover:bg-mp-accent"
      >
        Browse listings
      </Link>
    </div>
  );
}
