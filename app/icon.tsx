import { ImageResponse } from "next/og";

import { COUSIN_RADIO_BRAND } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          background: colors.pink,
          color: colors.ink,
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        {COUSIN_RADIO_BRAND.mark}
      </div>
    ),
    { ...size },
  );
}
