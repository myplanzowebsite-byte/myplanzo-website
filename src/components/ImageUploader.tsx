"use client";

import { useRef, useState } from "react";

// Mirror the server cap (src/app/api/uploads/route.ts) so we can reject
// oversized files instantly with an exact size, instead of round-tripping and
// hitting the platform's body limit (which returns no JSON to explain itself).
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function formatMB(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Prefer the server's own message. When the response has no JSON body — e.g.
 * the platform rejected an oversized request, or a proxy returned an HTML
 * error page — fall back to a status-specific reason so the user is never left
 * with a blank "Upload failed".
 */
function messageForFailure(status: number, serverError?: string): string {
  if (serverError) return serverError;
  switch (status) {
    case 401:
      return "Your session expired. Please refresh the page and sign in again.";
    case 403:
      return "You don't have permission to upload here.";
    case 413:
      return "Image is too large (max 4 MB). Please pick a smaller photo.";
    case 415:
      return "That image format isn't supported. Use JPG, PNG, WEBP or GIF.";
    case 502:
    case 503:
      return "Image storage is unavailable right now. Please try again in a moment.";
    default:
      return status >= 500
        ? `Upload failed on the server (HTTP ${status}). Please try again.`
        : `Upload failed (HTTP ${status}). Please try again.`;
  }
}

/**
 * Uploads a single image to /api/uploads and hands the resulting public URL
 * back via onUploaded. Stateless about where the URL goes — callers manage
 * single values or arrays themselves. Validates type/size client-side and
 * surfaces a specific reason for every failure mode.
 */
export function ImageUploader({
  onUploaded,
  label = "Upload image",
  disabled = false,
}: {
  onUploaded: (url: string) => void;
  label?: string;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (inputRef.current) inputRef.current.value = ""; // allow re-picking the same file
    if (!file) return;

    setError(null);

    // Fail fast, before any network call, with the exact reason.
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Please choose a JPG, PNG, WEBP or GIF.");
      return;
    }
    if (file.type && !ALLOWED.includes(file.type)) {
      setError(`“${file.type}” images aren't supported. Use JPG, PNG, WEBP or GIF.`);
      return;
    }
    if (file.size === 0) {
      setError("That file appears to be empty. Please pick another image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `Image is ${formatMB(file.size)} — the limit is 4 MB. Please pick a smaller photo or compress it first.`,
      );
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body });

      const data = await res.json().catch(() => null as { url?: string; error?: string } | null);

      if (!res.ok || !data?.url) {
        setError(messageForFailure(res.status, data?.error));
        return;
      }
      onUploaded(data.url);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => inputRef.current?.click()}
        className="rounded-md border border-mp-border bg-mp-panel px-3 py-1.5 text-sm text-mp-charcoal transition-colors hover:border-mp-accent disabled:opacity-60"
      >
        {busy ? "Uploading…" : label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFile}
        className="hidden"
      />
      {error ? (
        <p className="text-xs text-mp-accent">{error}</p>
      ) : (
        <p className="text-xs text-mp-text3">JPG, PNG, WEBP or GIF · up to 4 MB</p>
      )}
    </div>
  );
}
