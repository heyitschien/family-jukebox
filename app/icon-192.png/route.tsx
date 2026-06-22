import { ImageResponse } from "next/og";

import { renderAppIconMarkup } from "@/lib/app-icon";

const size = {
  width: 192,
  height: 192,
} as const;

export function GET() {
  return new ImageResponse(renderAppIconMarkup(size.width), size);
}
