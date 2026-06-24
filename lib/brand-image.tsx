import { BRAND_COLORS, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { getBrandLogoDataUrl } from "@/lib/brand-logo";

type BrandMarkOptions = {
  size: number;
  radius?: number;
};

type BrandWordmarkOptions = {
  titleSize?: number;
  subtitleSize?: number;
  subtitle?: string;
};

export function BrandMark({ size, radius = Math.round(size * 0.24) }: BrandMarkOptions) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- OG ImageResponse requires img
    <img
      src={getBrandLogoDataUrl()}
      alt=""
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        objectFit: "contain",
      }}
    />
  );
}

export function BrandWordmark({
  titleSize = 56,
  subtitleSize = 24,
  subtitle = BRAND_TAGLINE,
}: BrandWordmarkOptions) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: Math.max(subtitleSize * 0.25, 6) }}>
      <div
        style={{
          color: BRAND_COLORS.text,
          fontSize: titleSize,
          fontWeight: 900,
          letterSpacing: -1.5,
          lineHeight: 1,
        }}
      >
        {BRAND_NAME}
      </div>
      <div
        style={{
          color: BRAND_COLORS.muted,
          fontSize: subtitleSize,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
