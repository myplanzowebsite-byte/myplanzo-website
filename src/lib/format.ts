const inr = new Intl.NumberFormat("en-IN");

export function formatINR(n: number | null | undefined): string {
  if (n == null) return "";
  return `₹${inr.format(n)}`;
}

export function priceUnitForListing(opts: {
  title?: string | null;
  eventTags?: string[] | null;
}): string {
  const hay = `${opts.title ?? ""} ${(opts.eventTags ?? []).join(" ")}`.toLowerCase();
  if (/cater|plate|food|menu|thali|buffet/.test(hay)) return "per plate";
  if (/venue|hall|garden|banquet/.test(hay)) return "per day";
  return "starting";
}
