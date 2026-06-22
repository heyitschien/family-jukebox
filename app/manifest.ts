import type { MetadataRoute } from "next";

import { getSiteDescription, getSiteName } from "@/lib/site-env";

export default function manifest(): MetadataRoute.Manifest {
  const siteName = getSiteName();

  return {
    name: siteName,
    short_name: siteName === "Cousin Radio" ? "Cousin Radio" : "CR Staging",
    description: getSiteDescription(),
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#071015",
    theme_color: "#ff6fb1",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
