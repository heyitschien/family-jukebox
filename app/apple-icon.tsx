import { ImageResponse } from "next/og";

import { BrandAppIcon, getBrandIconDimensions } from "@/lib/brand-app-icon";

const APPLE_ICON_SIZE = 180;

export const size = getBrandIconDimensions(APPLE_ICON_SIZE);
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <BrandAppIcon size={APPLE_ICON_SIZE} variant="default" />,
    size,
  );
}
