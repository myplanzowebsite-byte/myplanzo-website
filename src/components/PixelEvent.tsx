"use client";

import { useEffect } from "react";
import { fbTrack } from "@/lib/fbpixel";

/**
 * Fires a single Meta Pixel standard event on mount. Lets server components
 * trigger client-side pixel events by dropping this in their JSX.
 */
export function PixelEvent({
  event,
  params,
}: {
  event: string;
  params?: Record<string, unknown>;
}) {
  useEffect(() => {
    fbTrack(event, params);
    // Fire once per mount; params are a snapshot of this page view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
