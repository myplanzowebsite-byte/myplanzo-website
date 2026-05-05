export function AuthSplitShell({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep?: number;
  totalSteps?: number;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-mp-soft-blue lg:flex-row">
      <div className="relative hidden w-1/2 overflow-hidden border-r border-mp-border bg-gradient-to-br from-mp-auth-left via-mp-soft-blue to-mp-sidebar p-10 lg:flex">
        <div className="relative z-10 flex h-full w-full flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full border border-mp-border bg-mp-card text-sm font-semibold text-mp-accent">
                M
              </div>
              <span className="text-xl font-semibold text-mp-charcoal">MyPlanzo</span>
            </div>
            <div className="mt-6 inline-flex rounded-full border border-mp-accent/20 bg-mp-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-mp-accent">
              Event planning, simplified
            </div>
            <p className="mt-4 max-w-sm text-lg leading-7 text-mp-muted">
              All your plans in one place, from discovery to booking and follow-up.
            </p>

            {/* Trust signals section */}
            <div className="mt-10 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-mp-accent">Why customers trust us</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔒</span>
                  <div>
                    <p className="font-medium text-mp-charcoal text-sm">Verified vendors</p>
                    <p className="text-xs text-mp-muted">Every vendor is verified and reviewed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">⭐</span>
                  <div>
                    <p className="font-medium text-mp-charcoal text-sm">Highly rated</p>
                    <p className="text-xs text-mp-muted">4.8/5 average vendor rating</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="font-medium text-mp-charcoal text-sm">Fast booking</p>
                    <p className="text-xs text-mp-muted">Book in minutes, not days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-4/5 max-w-md">
            <div className="absolute -right-4 top-6 size-20 rounded-full bg-mp-accent-soft/80 blur-xl" aria-hidden />
            <div className="absolute inset-0 rounded-[28px] border border-mp-border bg-gradient-to-br from-mp-card via-mp-panel to-mp-accent-soft shadow-mp-card" />
            <div className="absolute inset-x-6 top-6 rounded-2xl border border-mp-border bg-mp-card/95 p-4 text-xs text-mp-muted shadow-sm">
              Dashboard overview
            </div>
            <div className="absolute bottom-4 left-4 right-4 top-1/3 rounded-2xl border border-mp-border bg-mp-panel/95 p-4 text-xs text-mp-muted shadow-inner">
              Calendar, bookings, and vendor follow-ups — organized in one calm workspace.
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-center bg-mp-panel px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md rounded-[var(--radius-mp-card)] border border-mp-border bg-mp-card/95 p-6 shadow-[var(--shadow-mp-card)] sm:p-8">
          {/* Step indicator for multi-step flows */}
          {totalSteps && totalSteps > 1 && currentStep && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-mp-muted mb-2">
                <span>Step {currentStep} of {totalSteps}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-mp-border overflow-hidden">
                <div 
                  className="h-full bg-mp-accent transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          )}

          <h1 className="text-2xl font-semibold text-mp-charcoal">{title}</h1>
          {subtitle ? <p className="mt-1.5 text-sm leading-6 text-mp-muted">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
