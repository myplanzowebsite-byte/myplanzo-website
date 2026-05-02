"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Request failed");
        return;
      }
      setMessage(data.message || "If an account exists, an OTP was sent to the registered phone.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell
      title="Forgot Password"
      subtitle="Enter your email address and we&apos;ll send an OTP to your registered mobile to reset your password."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        {error ? (
          <p
            className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-sm text-mp-accent"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-md border border-mp-border bg-mp-soft-blue px-3 py-2 text-sm text-mp-charcoal" role="status">
            {message}
          </p>
        ) : null}
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-mp-charcoal py-3 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Sending…" : "Continue"}
        </button>
        <p className="text-center text-sm text-mp-muted">
          <Link
            href="/login"
            className="font-medium text-mp-accent underline-offset-4 hover:text-mp-charcoal hover:underline"
          >
            Back to login
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
}
