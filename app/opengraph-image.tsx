import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";

export const alt = "Cousin Radio — family songs and little anthems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
          background: "linear-gradient(145deg, #0b0f14 0%, #17212c 45%, #1a0812 100%)",
          color: "#f8fafc",
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
              background: "#ff6fb1",
              color: "#1a0812",
              fontSize: 48,
              fontWeight: 900,
            }}
          >
            ♪
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: -1 }}>{SITE_NAME}</div>
            <div style={{ fontSize: 28, color: "#94a3b8", fontWeight: 700 }}>
              Little anthems · family jukebox
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
