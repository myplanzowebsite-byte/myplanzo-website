"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/customer";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      if (data.redirect) {
        router.push(data.redirect === "/admin" ? "/admin" : data.redirect);
        router.refresh();
        return;
      }
      if (data.next === "verify-otp" && data.phone) {
        const q = new URLSearchParams({
          phone: data.phone,
          purpose: "login",
          next,
        });
        if (remember) q.set("remember", "1");
        if (process.env.NODE_ENV === "development" && typeof data.devOtp === "string") {
          q.set("devOtp", data.devOtp);
        }
        router.push(`/verify-otp?${q.toString()}`);
        return;
      }
      setError("Unexpected response");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell
      title="Welcome back"
      subtitle="Log in with your email and password"
      currentStep={1}
      totalSteps={2}
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
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-mp-charcoal" htmlFor="password">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-mp-accent underline-offset-4 hover:text-mp-charcoal hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-mp-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-mp-accent"
          />
          Remember me
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-mp-charcoal py-3 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
        <p className="text-center text-sm text-mp-muted">
          New here?{" "}
          <Link
            href="/register"
            className="font-medium text-mp-accent underline-offset-4 hover:text-mp-charcoal hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-mp-panel text-sm text-mp-muted">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
