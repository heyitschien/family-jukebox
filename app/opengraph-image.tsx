import { ImageResponse } from "next/og";

import { COUSIN_RADIO_BRAND } from "@/lib/brand";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";

export const alt = "Cousin Radio — family songs and little anthems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const colors = COUSIN_RADIO_BRAND.colors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(145deg, ${colors.dark} 0%, #17212c 45%, ${colors.ink} 100%)`,
          color: colors.text,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: colors.pink,
              color: colors.ink,
              fontSize: 48,
              fontWeight: 900,
            }}
          >
            {COUSIN_RADIO_BRAND.mark}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1 }}>{SITE_NAME}</div>
            <div style={{ fontSize: 28, color: "#94a3b8", fontWeight: 700 }}>
              {COUSIN_RADIO_BRAND.tagline}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, color: "#cbd5e1", maxWidth: 920 }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
