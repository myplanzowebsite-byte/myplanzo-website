/**
 * The 50/50 split used by the staged-payment flow. Single source of truth so
 * the create-order route, checkout page, and booking pages all agree on the
 * exact paise. On an odd total the advance carries the extra paise so the two
 * installments always sum back to the full amount.
 */
export function advancePaise(totalPaise: number): number {
  return Math.ceil(totalPaise / 2);
}

export function balancePaise(totalPaise: number): number {
  return totalPaise - advancePaise(totalPaise);
}
