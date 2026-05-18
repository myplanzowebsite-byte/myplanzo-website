"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELD =
  "w-full rounded-md border border-mp-border bg-mp-panel px-3 py-2 text-sm outline-none ring-mp-accent/20 focus:border-mp-accent focus:ring-2";

function Notice({ kind, text }: { kind: "ok" | "err" | "info"; text: string }) {
  const cls =
    kind === "ok"
      ? "border-green-500/20 bg-green-500/10 text-green-700"
      : kind === "err"
        ? "border-mp-accent/20 bg-mp-accent-soft text-mp-accent"
        : "border-mp-border bg-mp-panel text-mp-muted";
  return <p className={`rounded-md border px-3 py-2 text-xs ${cls}`}>{text}</p>;
}

function ChangePasswordPanel() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dev, setDev] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function sendCode() {
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customer/security/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not send code.");
        return;
      }
      setSent(true);
      if (data.devOtp) setDev(data.devOtp);
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customer/security/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not change password.");
        return;
      }
      setDone(true);
      setSent(false);
      setOtp("");
      setCurrentPassword("");
      setNewPassword("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 border-t border-mp-border pt-4">
      <p className="text-sm font-medium text-mp-charcoal">Change password</p>
      {done && <Notice kind="ok" text="Password updated." />}
      {err && <Notice kind="err" text={err} />}
      {!sent ? (
        <button
          onClick={sendCode}
          disabled={busy}
          className="rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:bg-mp-warm disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send verification code to my phone"}
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          {dev && <Notice kind="info" text={`Dev OTP: ${dev}`} />}
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className={FIELD}
          />
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className={FIELD}
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 characters)"
            className={FIELD}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}

function ChangePhonePanel({ currentPhone }: { currentPhone: string }) {
  const router = useRouter();
  const [newPhone, setNewPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dev, setDev] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function sendCode() {
    setErr(null);
    if (newPhone.trim().length < 10) {
      setErr("Enter a valid phone number.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/customer/security/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: newPhone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not send code.");
        return;
      }
      setSent(true);
      if (data.devOtp) setDev(data.devOtp);
    } finally {
      setBusy(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch("/api/customer/security/change-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, newPhone: newPhone.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || "Could not change number.");
        return;
      }
      setDone(true);
      setSent(false);
      setOtp("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2 border-t border-mp-border pt-4">
      <p className="text-sm font-medium text-mp-charcoal">Change mobile number</p>
      <p className="text-xs text-mp-muted">Current: {currentPhone}</p>
      {done && <Notice kind="ok" text="Mobile number updated." />}
      {err && <Notice kind="err" text={err} />}
      {!sent ? (
        <div className="space-y-2">
          <input
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="New mobile number"
            className={FIELD}
          />
          <button
            onClick={sendCode}
            disabled={busy}
            className="rounded-md border border-mp-border px-3 py-1.5 text-sm text-mp-charcoal hover:bg-mp-warm disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send code to this number"}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-2">
          {dev && <Notice kind="info" text={`Dev OTP: ${dev}`} />}
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className={FIELD}
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-md bg-mp-charcoal px-4 py-2 text-sm text-mp-panel transition-colors hover:bg-mp-accent disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update number"}
          </button>
        </form>
      )}
    </div>
  );
}

export function SecuritySettings({ currentPhone }: { currentPhone: string }) {
  return (
    <section className="space-y-2 rounded-[var(--radius-mp-card)] bg-mp-card p-6 shadow-[var(--shadow-mp-card)]">
      <div>
        <h2 className="text-sm font-semibold text-mp-charcoal">Security</h2>
        <p className="text-xs text-mp-muted">
          Sensitive changes require a one-time code sent by SMS.
        </p>
      </div>
      <ChangePasswordPanel />
      <ChangePhonePanel currentPhone={currentPhone} />
    </section>
  );
}
