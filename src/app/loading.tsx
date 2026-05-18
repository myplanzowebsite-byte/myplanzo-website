export default function Loading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-3"
      style={{ background: "rgba(15,15,15,1)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="MyPlanzo"
        style={{ height: 48, width: "auto", filter: "invert(1)" }}
      />
      <span className="h-1 w-24 overflow-hidden rounded-full bg-white/15">
        <span className="block h-full w-1/2 animate-pulse rounded-full bg-white/70" />
      </span>
    </div>
  );
}
