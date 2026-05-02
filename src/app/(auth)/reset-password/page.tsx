"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/AuthSplitShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Reset failed");
        return;
      }
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitShell
      title="Reset your password"
      subtitle="Enter the OTP from SMS and choose a new password."
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
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="phone">
            Mobile number
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
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="code">
            OTP code
          </label>
          <input
            id="code"
            inputMode="numeric"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="np">
            New password
          </label>
          <input
            id="np"
            type="password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-mp-charcoal" htmlFor="cp">
            Confirm password
          </label>
          <input
            id="cp"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-mp-border bg-mp-card px-3 py-2.5 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2"
          />
        </div>
        <ul className="list-disc space-y-1 pl-4 text-xs text-mp-muted">
          <li>At least 8 characters</li>
          <li>Mix of letters and numbers recommended</li>
        </ul>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-mp-charcoal py-3 text-sm font-semibold text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
        >
          {loading ? "Updating…" : "Update password"}
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
