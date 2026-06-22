import { ImageResponse } from "next/og";

type AppIconPurpose = "any" | "maskable";

type AppIconImageOptions = {
  size: number;
  purpose?: AppIconPurpose;
};

export function createAppIconResponse({ size, purpose = "any" }: AppIconImageOptions): ImageResponse {
  const safeZoneScale = purpose === "maskable" ? 0.66 : 0.74;
  const badgeSize = Math.round(size * safeZoneScale);
  const badgeRadius = Math.round(badgeSize * 0.24);
  const glyphSize = Math.round(badgeSize * 0.46);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 22% 18%, #ffcce4 0%, #ff6fb1 45%, #6cb7ff 100%)",
        }}
      >
        <div
          style={{
            width: badgeSize,
            height: badgeSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: badgeRadius,
            background: "linear-gradient(145deg, #09131c 0%, #122133 72%, #1e2f45 100%)",
            border: `${Math.max(2, Math.round(size * 0.014))}px solid rgba(255, 255, 255, 0.22)`,
            boxShadow: `0 ${Math.round(size * 0.05)}px ${Math.round(size * 0.12)}px rgba(9, 19, 28, 0.35)`,
            color: "#ffb8d9",
            fontSize: glyphSize,
            fontWeight: 900,
            letterSpacing: -1,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          ♪
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}
