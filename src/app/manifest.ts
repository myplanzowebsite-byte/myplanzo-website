import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyPlanzo — Book event vendors in Mumbai",
    short_name: "MyPlanzo",
    description:
      "Find verified decorators, caterers, photographers & venues for birthdays, baby showers and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f0f",
    theme_color: "#0f0f0f",
    icons: [
      // SVG scales to any launcher size; the JPG is a raster fallback.
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/logo.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" },
    ],
  };
}
