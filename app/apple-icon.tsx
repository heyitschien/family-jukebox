import { ImageResponse } from "next/og";

import { COUSIN_RADIO_BRAND } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const colors = COUSIN_RADIO_BRAND.colors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: `linear-gradient(145deg, ${colors.pink} 0%, ${colors.pinkLight} 100%)`,
          color: colors.ink,
          fontSize: 96,
          fontWeight: 900,
        }}
      >
        {COUSIN_RADIO_BRAND.mark}
      </div>
    ),
    { ...size },
  );
}
