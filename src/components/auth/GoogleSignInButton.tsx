"use client";

import { useCallback, useRef, useState } from "react";
import Script from "next/script";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Renders the official Google Identity Services button. On success Google hands
 * us an ID token ("credential") which we post to /api/auth/google; the server
 * verifies it, sets the session cookie and tells us where to go next.
 */
export function GoogleSignInButton({
  next,
  dividerLabel,
}: {
  next?: string;
  /** When set, renders an "<label>" divider below the button. */
  dividerLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // The login page resolves `next` from the URL after first render, but GIS is
  // initialized once — read the latest value through a ref inside the callback.
  const nextRef = useRef(next);
  nextRef.current = next;

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleCredential = useCallback(async (response: GoogleIdCredentialResponse) => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential, next: nextRef.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error || "Google sign-in failed");
        setBusy(false);
        return;
      }
      // Full navigation so server components pick up the new session cookie.
      window.location.assign(data.redirect || "/customer");
    } catch {
      setError("Google sign-in failed. Please try again.");
      setBusy(false);
    }
  }, []);

  const initGis = useCallback(() => {
    if (!CLIENT_ID || !window.google || !containerRef.current) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(containerRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 320,
    });
  }, [handleCredential]);

  if (!CLIENT_ID) return null;

  return (
    <div className="space-y-2">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={initGis}
      />
      <div className="flex justify-center">
        <div ref={containerRef} aria-busy={busy} />
      </div>
      {error ? (
        <p
          className="rounded-md border border-mp-accent/20 bg-mp-accent-soft px-3 py-2 text-sm text-mp-accent"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {dividerLabel ? (
        <div className="flex items-center gap-3 pt-2 text-xs text-mp-muted">
          <span className="h-px flex-1 bg-mp-border" />
          {dividerLabel}
          <span className="h-px flex-1 bg-mp-border" />
        </div>
      ) : null}
    </div>
  );
}
