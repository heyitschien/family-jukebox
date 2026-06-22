import type { MetadataRoute } from "next";

import { getSiteDescription, getSiteName } from "@/lib/site-env";

export const APP_THEME_COLOR = "#0b0f14";
export const APP_BACKGROUND_COLOR = "#0b0f14";

export const APP_ICON_PATHS = {
  favicon32: "/icon/32",
  icon192: "/icon/192",
  icon512: "/icon/512",
  icon512Maskable: "/icon/512-maskable",
  appleTouch: "/apple-icon",
} as const;

export function buildWebAppManifest(): MetadataRoute.Manifest {
  return {
    name: getSiteName(),
    short_name: "Cousin Radio",
    description: getSiteDescription(),
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: APP_BACKGROUND_COLOR,
    theme_color: APP_THEME_COLOR,
    icons: [
      {
        src: APP_ICON_PATHS.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: APP_ICON_PATHS.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: APP_ICON_PATHS.icon512Maskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
