import { ImageResponse } from "next/og";

import { BrandAppIcon } from "@/components/brand-app-icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<BrandAppIcon />, { ...size });
}
