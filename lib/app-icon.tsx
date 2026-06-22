import type { MetadataRoute } from "next";
import type { ReactElement } from "react";

import { getAppEnvironment, getSiteDescription, getSiteName } from "@/lib/site-env";

export const APP_ICON_BACKGROUND = "#071015";
export const APP_ICON_FOREGROUND = "#1a0812";

const PRODUCTION_PINK = "#ff6fb1";
const PRODUCTION_OCEAN = "#6cb7ff";
const STAGING_GOLD = "#fbbf24";
const STAGING_AMBER = "#fdba74";

const APP_ICON_192_PATH = "/icon-192.png";
const APP_ICON_512_PATH = "/icon-512.png";

type AppIconPalette = {
  accentStart: string;
  accentEnd: string;
  glow: string;
  badge: string;
};

function getAppIconPalette(): AppIconPalette {
  if (getAppEnvironment() === "staging") {
    return {
      accentStart: STAGING_GOLD,
      accentEnd: STAGING_AMBER,
      glow: "#fde68a",
      badge: "◎",
    };
  }

  return {
    accentStart: PRODUCTION_PINK,
    accentEnd: PRODUCTION_OCEAN,
    glow: "#c4b5fd",
    badge: "♪",
  };
}

export function renderAppIconMarkup(size: number): ReactElement {
  const palette = getAppIconPalette();
  const badgeSize = Math.round(size * 0.18);
  const badgeOffset = Math.round(size * 0.12);
  const cardInset = Math.round(size * 0.08);
  const monogramSize = Math.round(size * 0.26);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #071015 0%, #17212c 48%, #1a0812 100%)",
        padding: cardInset,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: Math.round(size * 0.28),
          background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 100%)",
          border: "2px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "74%",
            height: "74%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(size * 0.2),
            background: `linear-gradient(135deg, ${palette.accentStart} 0%, ${palette.accentEnd} 100%)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: APP_ICON_FOREGROUND,
              fontSize: monogramSize,
              fontWeight: 900,
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            CR
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: badgeOffset,
            right: badgeOffset,
            display: "flex",
            width: badgeSize,
            height: badgeSize,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "999px",
            background: palette.glow,
            color: APP_ICON_FOREGROUND,
            fontSize: Math.round(size * 0.1),
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {palette.badge}
        </div>
      </div>
    </div>
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
