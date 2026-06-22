import type { MetadataRoute } from "next";

import { getSiteDescription, getSiteName } from "@/lib/site-env";

export default function manifest(): MetadataRoute.Manifest {
  const appName = getSiteName();

  return {
    name: appName,
    short_name: appName,
    description: getSiteDescription(),
    start_url: "/",
    display: "standalone",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    icons: [
      {
        src: "/pwa-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/pwa-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/pwa-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
