import { ImageResponse } from "next/og";

import { BrandAppIcon, getBrandIconDimensions } from "@/lib/brand-app-icon";

export const contentType = "image/png";

const ICON_VARIANTS = [
  { id: "32", size: 32, variant: "default" as const },
  { id: "192", size: 192, variant: "default" as const },
  { id: "512", size: 512, variant: "default" as const },
  { id: "512-maskable", size: 512, variant: "maskable" as const },
] as const;

export function generateImageMetadata() {
  return ICON_VARIANTS.map(({ id, size }) => ({
    id,
    size: getBrandIconDimensions(size),
    contentType: "image/png" as const,
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const iconId = await id;
  const config = ICON_VARIANTS.find((item) => item.id === iconId) ?? ICON_VARIANTS[0];

  return new ImageResponse(
    <BrandAppIcon size={config.size} variant={config.variant} />,
    getBrandIconDimensions(config.size),
  );
}
