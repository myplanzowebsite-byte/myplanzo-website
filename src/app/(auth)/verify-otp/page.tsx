"use client";

import { Suspense, useMemo, useState } from "react";
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

  const code = useMemo(() => digits.join(""), [digits]);

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

  return (
    <AuthSplitShell
      title="Verify OTP"
      subtitle={`Enter the code we sent to your mobile number ending …${phone.slice(-4)}`}
    >
      <form className="space-y-6" onSubmit={onSubmit}>
        {process.env.NODE_ENV === "development" && devOtpHint ? (
          <p className="rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-sm text-mp-charcoal" role="status">
            <strong>Development only:</strong> your OTP is <strong className="tracking-widest">{devOtpHint}</strong>{" "}
            (also logged in the terminal as <code className="text-xs">[SMS mock]</code>).
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
