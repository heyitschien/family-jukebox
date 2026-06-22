import { ImageResponse } from "next/og";

import { BrandMark, BrandWordmark } from "@/lib/brand-image";
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
          <BrandMark size={88} radius={24} />
          <BrandWordmark titleSize={56} subtitleSize={28} subtitle="Little anthems · cousin-made songs" />
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.35, color: "#cbd5e1", maxWidth: 920 }}>
          {SITE_DESCRIPTION}
        </div>
        <div style={{ fontSize: 18, lineHeight: 1.2, color: "#64748b", fontWeight: 700 }}>{SITE_NAME}</div>
      </div>
    ),
    { ...size },
  );
}
