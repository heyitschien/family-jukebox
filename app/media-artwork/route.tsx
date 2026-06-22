import { ImageResponse } from "next/og";

import {
  COUSIN_RADIO_BRAND,
  COUSIN_RADIO_MEDIA_ARTWORK_SIZES,
} from "@/lib/brand";

const DEFAULT_ARTWORK_SIZE = 1024;

function getArtworkSize(request: Request): number {
  const requestedSize = Number(new URL(request.url).searchParams.get("size"));
  const validSize = COUSIN_RADIO_MEDIA_ARTWORK_SIZES.find((size) => size === requestedSize);

  return validSize ?? DEFAULT_ARTWORK_SIZE;
}

export function GET(request: Request) {
  const imageSize = getArtworkSize(request);
  const scale = imageSize / DEFAULT_ARTWORK_SIZE;
  const colors = COUSIN_RADIO_BRAND.colors;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 42 * scale,
          background: `linear-gradient(145deg, ${colors.dark} 0%, #17212c 45%, ${colors.ink} 100%)`,
          color: colors.text,
          fontFamily: "system-ui, sans-serif",
          padding: 80 * scale,
        }}
      >
        <div
          style={{
            width: 420 * scale,
            height: 420 * scale,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 118 * scale,
            background: `linear-gradient(145deg, ${colors.pink} 0%, ${colors.pinkLight} 100%)`,
            color: colors.ink,
            boxShadow: `0 ${36 * scale}px ${92 * scale}px rgba(255, 111, 177, 0.34)`,
            fontSize: 230 * scale,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {COUSIN_RADIO_BRAND.mark}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10 * scale,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 94 * scale,
              fontWeight: 900,
              letterSpacing: -4 * scale,
              lineHeight: 0.95,
            }}
          >
            Cousin Radio
          </div>
          <div
            style={{
              color: colors.muted,
              fontSize: 34 * scale,
              fontWeight: 800,
              letterSpacing: 1.5 * scale,
              textTransform: "uppercase",
            }}
          >
            Family songs
          </div>
        </div>
      </div>
    ),
    {
      width: imageSize,
      height: imageSize,
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=31536000",
      },
    },
  );
}
