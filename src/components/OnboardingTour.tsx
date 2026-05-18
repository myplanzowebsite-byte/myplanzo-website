"use client";

import { useEffect, useState } from "react";

export type TourStep = { title: string; body: string };

/**
 * A skippable, overlay-style onboarding walkthrough. Shows once per browser
 * (tracked in localStorage under `tourId`); cleared by the Replay button on
 * the Help page.
 */
export function OnboardingTour({ tourId, steps }: { tourId: string; steps: TourStep[] }) {
  const [visible, setVisible] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(tourId)) {
      setVisible(true);
    }
  }, [tourId]);

  function finish() {
    try {
      localStorage.setItem(tourId, "done");
    } catch {
      /* ignore storage errors */
    }
    setVisible(false);
  }

  if (!visible || steps.length === 0) return null;
  const step = steps[i];
  const last = i === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
        <p className="text-xs text-mp-muted">
          Step {i + 1} of {steps.length}
        </p>
        <h3 className="mt-1 text-lg font-semibold text-mp-charcoal">{step.title}</h3>
        <p className="mt-2 text-sm text-mp-muted">{step.body}</p>

        <div className="mt-5 flex items-center justify-between">
          <button onClick={finish} className="text-sm text-mp-muted underline">
            Skip
          </button>
          <div className="flex gap-2">
            {i > 0 && (
              <button
                onClick={() => setI(i - 1)}
                className="rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:bg-mp-warm"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (last ? finish() : setI(i + 1))}
              className="rounded-md bg-mp-charcoal px-4 py-1.5 text-sm text-mp-panel transition-colors hover:bg-mp-accent"
            >
              {last ? "Done" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
