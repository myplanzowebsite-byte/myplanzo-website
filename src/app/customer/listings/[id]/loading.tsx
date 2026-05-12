export default function ListingLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-mp-border" />
      <div className="h-64 w-full rounded-[var(--radius-mp-card)] bg-mp-border" />
      <div className="space-y-4 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <div className="h-7 w-2/3 rounded bg-mp-border" />
        <div className="h-4 w-1/3 rounded bg-mp-border" />
        <div className="h-px w-full bg-mp-border" />
        <div className="flex gap-6">
          <div className="h-10 w-24 rounded bg-mp-border" />
          <div className="h-10 w-24 rounded bg-mp-border" />
          <div className="h-10 w-24 rounded bg-mp-border" />
        </div>
        <div className="h-20 w-full rounded bg-mp-border" />
      </div>
    </div>
  );
}
