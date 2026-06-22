import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          background: "#ff6fb1",
          color: "#1a0812",
          fontSize: 20,
          fontWeight: 900,
        }}
      >
        ♪
      </div>
    ),
    { ...size },
  );
}
