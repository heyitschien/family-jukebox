import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          background: "linear-gradient(145deg, #ff6fb1 0%, #ff9ec8 100%)",
          color: "#1a0812",
          fontSize: 96,
          fontWeight: 900,
        }}
      >
        ♪
      </div>
    ),
    { ...size },
  );
}
