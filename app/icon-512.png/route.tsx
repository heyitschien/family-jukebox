import { ImageResponse } from "next/og";

import { renderAppIconMarkup } from "@/lib/app-icon";

const size = {
  width: 512,
  height: 512,
} as const;

export function GET() {
  return new ImageResponse(renderAppIconMarkup(size.width), size);
}
