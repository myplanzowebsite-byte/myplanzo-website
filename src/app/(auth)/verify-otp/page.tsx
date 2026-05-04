"use client";

import { Suspense, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";

function VerifyOtpForm() {
  const router = useRouter();
  const search = useSearchParams();
  const phone = search.get("phone") || "";
  const purpose = (search.get("purpose") || "register") as "register" | "login";
  const next = search.get("next") || "/customer";
  const devOtpHint = search.get("devOtp");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const code = useMemo(() => digits.join(""), [digits]);

  // Resend countdown effect
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (resendCountdown === 0 && !canResend) setCanResend(true);
  }, [resendCountdown, canResend]);

  function setDigit(i: number, v: string) {
    const d = v.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[i] = d;
    setDigits(nextDigits);
    if (d && i < 5) {
      const el = document.getElementById(`otp-${i + 1}`);
      (el as HTMLInputElement | null)?.focus();
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, purpose }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }
      const dest = data.redirect || next;
      router.push(dest);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setCanResend(false);
    setResendCountdown(60);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose }),
      });
      if (!res.ok) {
        setError("Failed to resend OTP");
        setCanResend(true);
        setResendCountdown(0);
      }
    } catch {
      setError("Failed to resend OTP");
      setCanResend(true);
      setResendCountdown(0);
    }
  }

  return (
    <AuthSplitShell
      title="Verify your number"
      subtitle={`Enter the 6-digit code we sent to ${phone}`}
      currentStep={2}
      totalSteps={2}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {devOtpHint ? (
          <p className="rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-sm text-mp-charcoal" role="status">
            <strong>Your OTP is:</strong> <strong className="tracking-widest">{devOtpHint}</strong>
          </p>
        ) : null}
        {error ? (
          <p
            className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-sm text-mp-accent"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div className="flex justify-between gap-2">
          {digits.map((d, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              className="h-12 w-12 rounded-md border border-mp-border bg-mp-card text-center text-lg font-semibold outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
            />
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-mp-charcoal py-3 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Continue"}
        </button>

        {/* Resend OTP section */}
        <div className="text-center">
          <p className="text-sm text-mp-muted mb-2">Didn&apos;t receive code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="text-sm font-medium text-mp-accent hover:text-mp-charcoal disabled:opacity-50"
          >
            {canResend ? "Resend OTP" : `Resend in ${resendCountdown}s`}
          </button>
        </div>
      </form>
    </AuthSplitShell>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-mp-panel text-sm text-mp-muted">
          Loading…
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
