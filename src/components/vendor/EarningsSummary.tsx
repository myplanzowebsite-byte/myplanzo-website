import { formatINR } from "@/lib/format";

const COMMISSION_RATE = 0.15;
const MONTH_FMT = new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" });

export type EarningsPayment = {
  status: string;
  amountPaise: number;
  commissionPaise: number;
  createdAt: Date;
  category: string | null;
};

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-[var(--radius-mp-card)] bg-mp-card p-4 shadow-[var(--shadow-mp-card)]">
      <p className="text-xs text-mp-muted">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ? "text-mp-accent" : "text-mp-charcoal"}`}>
        {value}
      </p>
    </div>
  );
}

/**
 * Renders the vendor earnings breakdown — stat cards, a 6-month net-payout
 * chart, and a by-category split. Pure rendering; pass the vendor's payments.
 */
export function EarningsSummary({ payments }: { payments: EarningsPayment[] }) {
  const commissionOf = (p: EarningsPayment) =>
    p.commissionPaise || Math.round(p.amountPaise * COMMISSION_RATE);

  const captured = payments.filter((p) => p.status === "CAPTURED");
  const pending = payments.filter((p) => p.status === "PENDING" || p.status === "AUTHORIZED");

  const grossPaise = captured.reduce((s, p) => s + p.amountPaise, 0);
  const commissionPaise = captured.reduce((s, p) => s + commissionOf(p), 0);
  const netPaise = grossPaise - commissionPaise;
  const pendingPaise = pending.reduce((s, p) => s + p.amountPaise, 0);

  const byCategory = new Map<string, number>();
  for (const p of captured) {
    const cat = p.category || "Other";
    byCategory.set(cat, (byCategory.get(cat) ?? 0) + (p.amountPaise - commissionOf(p)));
  }
  const categoryRows = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const categoryMax = Math.max(1, ...categoryRows.map(([, v]) => v));

  const now = new Date();
  const months: { label: string; key: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: MONTH_FMT.format(d), key: `${d.getFullYear()}-${d.getMonth()}`, total: 0 });
  }
  for (const p of captured) {
    const d = new Date(p.createdAt);
    const m = months.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (m) m.total += p.amountPaise - commissionOf(p);
  }
  const monthMax = Math.max(1, ...months.map((m) => m.total));

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Gross earnings" value={formatINR(grossPaise / 100)} />
        <Stat label="Commission (15%)" value={`- ${formatINR(commissionPaise / 100)}`} />
        <Stat label="Net payout" value={formatINR(netPaise / 100)} accent />
        <Stat label="Pending / processing" value={formatINR(pendingPaise / 100)} />
      </div>

      <section className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h3 className="mb-4 text-sm font-semibold text-mp-charcoal">Net payout — last 6 months</h3>
        <div className="flex h-44 items-end gap-3">
          {months.map((m) => (
            <div key={m.key} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-mp-muted">
                {m.total > 0 ? formatINR(Math.round(m.total / 100)) : ""}
              </span>
              <div
                className="w-full rounded-t bg-mp-accent/70"
                style={{ height: `${Math.max(2, (m.total / monthMax) * 130)}px` }}
              />
              <span className="text-[10px] text-mp-muted">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <h3 className="mb-4 text-sm font-semibold text-mp-charcoal">Net payout by category</h3>
        {categoryRows.length === 0 ? (
          <p className="text-sm text-mp-muted">No settled earnings yet.</p>
        ) : (
          <div className="space-y-3">
            {categoryRows.map(([cat, val]) => (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-mp-charcoal">{cat}</span>
                  <span className="text-mp-muted">{formatINR(val / 100)}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-mp-panel">
                  <div
                    className="h-2.5 rounded-full bg-mp-charcoal"
                    style={{ width: `${(val / categoryMax) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
