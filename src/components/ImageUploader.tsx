"use client";

import { useRef, useState } from "react";

/**
 * Uploads a single image to /api/uploads and hands the resulting public URL
 * back via onUploaded. Stateless about where the URL goes — callers manage
 * single values or arrays themselves.
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
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Upload failed");
        return;
      }
      onUploaded(data.url);
    } catch {
      setError("Upload failed");
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
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
      {error && <p className="text-xs text-mp-accent">{error}</p>}
    </div>
  );
}
