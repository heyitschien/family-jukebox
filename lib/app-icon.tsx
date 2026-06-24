import type { MetadataRoute } from "next";
import type { ReactElement } from "react";

import { getBrandLogoDataUrl } from "@/lib/brand-logo";
import { getAppEnvironment, getSiteDescription, getSiteName } from "@/lib/site-env";

export const APP_ICON_BACKGROUND = "#071015";

const APP_ICON_192_PATH = "/icon-192.png";
const APP_ICON_512_PATH = "/icon-512.png";

/** Legacy OG icon renderer — uses the official Cousin Radio logo asset. */
export function renderAppIconMarkup(size: number): ReactElement {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- ImageResponse / Satori
    <img
      src={getBrandLogoDataUrl()}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export function buildWebManifest(): MetadataRoute.Manifest {
  const isStaging = getAppEnvironment() === "staging";

  return {
    id: "/",
    name: getSiteName(),
    short_name: isStaging ? "CR Staging" : "Cousin Radio",
    description: getSiteDescription(),
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: APP_ICON_BACKGROUND,
    theme_color: APP_ICON_BACKGROUND,
    icons: [
      {
        src: APP_ICON_192_PATH,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: APP_ICON_192_PATH,
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: APP_ICON_512_PATH,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: APP_ICON_512_PATH,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
