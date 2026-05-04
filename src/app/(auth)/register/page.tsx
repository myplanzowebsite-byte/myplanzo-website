"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setDevOtp(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone,
          password,
          role,
          displayName: displayName || undefined,
          businessName: role === "VENDOR" ? businessName : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      if (data.devOtp) setDevOtp(data.devOtp);
      const otpParam = data.devOtp ? `&devOtp=${encodeURIComponent(data.devOtp)}` : "";
      router.push(`/verify-otp?phone=${encodeURIComponent(phone)}&purpose=register${otpParam}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell
      title="Create your account"
      subtitle="Choose whether you are booking events or offering services."
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
        {devOtp ? (
          <p className="rounded-md border border-mp-border bg-mp-warm px-3 py-2 text-sm text-mp-charcoal">
            Dev OTP: <strong>{devOtp}</strong>
          </p>
        ) : null}
        <div className="flex gap-2">
          {(["CUSTOMER", "VENDOR"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                role === r
                  ? "border-mp-accent bg-mp-accent text-mp-panel"
                  : "border-mp-border bg-mp-card text-mp-charcoal hover:border-mp-accent/40 hover:bg-mp-panel"
              }`}
            >
              {r === "CUSTOMER" ? "I am a Customer" : "I am a Vendor"}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="email">
            Email
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
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="phone">
            Mobile (SMS OTP)
          </label>
          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        {role === "CUSTOMER" ? (
          <div>
            <label className="text-sm font-medium text-mp-charcoal" htmlFor="dn">
              Display name
            </label>
            <input
              id="dn"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-mp-charcoal" htmlFor="bn">
              Business name
            </label>
            <input
              id="bn"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
            />
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-mp-charcoal py-3 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Creating…" : "Continue"}
        </button>
        <p className="text-center text-sm text-mp-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-mp-accent underline-offset-4 hover:text-mp-charcoal hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthSplitShell>
  );
}
