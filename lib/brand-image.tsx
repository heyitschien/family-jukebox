import { BRAND_COLORS, BRAND_NAME, BRAND_SHORT_NAME, BRAND_TAGLINE } from "@/lib/brand";

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
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: radius,
        background:
          "linear-gradient(145deg, rgba(17,24,39,1) 0%, rgba(26,8,18,1) 58%, rgba(255,111,177,0.92) 140%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 16px 40px rgba(0,0,0,0.28)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: size * 0.06,
          borderRadius: Math.max(radius - size * 0.06, 0),
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.45,
          height: size * 0.45,
          right: -size * 0.08,
          top: -size * 0.04,
          borderRadius: "9999px",
          background: "radial-gradient(circle, rgba(255,209,102,0.35) 0%, rgba(255,209,102,0) 72%)",
        }}
      />
      <span
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: size * 0.01,
          color: BRAND_COLORS.text,
          fontSize: size * 0.42,
          fontWeight: 900,
          letterSpacing: `${-size * 0.055}px`,
          lineHeight: 0.82,
        }}
      >
        {BRAND_SHORT_NAME}
      </span>
      <span
        style={{
          position: "absolute",
          right: size * 0.15,
          top: size * 0.16,
          width: size * 0.1,
          height: size * 0.1,
          borderRadius: "9999px",
          background: BRAND_COLORS.glow,
          boxShadow: `0 0 ${size * 0.14}px rgba(255, 209, 102, 0.55)`,
        }}
      />
    </div>
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
