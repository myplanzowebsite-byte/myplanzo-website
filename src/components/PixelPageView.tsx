"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { fbTrack } from "@/lib/fbpixel";

/**
 * Fires a Meta Pixel `PageView` on client-side route changes. The base snippet
 * in the root layout already fires the first PageView on hard load, so we skip
 * the initial effect run to avoid double-counting and only track SPA navigations.
 */
export function PixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    fbTrack("PageView");
  }, [pathname, searchParams]);

  return null;
}
