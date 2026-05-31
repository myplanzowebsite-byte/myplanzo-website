// Meta (Facebook) Pixel helper.
//
// The base pixel snippet is injected once in the root layout (see app/layout.tsx),
// which defines the global `fbq`. This module gives the rest of the app a typed,
// SSR-safe way to fire standard events without repeating the `window.fbq` dance.

export const FB_PIXEL_ID = "2483636635419982";

type FbqParams = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fire a Meta Pixel standard event. No-ops on the server or before the pixel loads. */
export function fbTrack(event: string, params?: FbqParams): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}
