type BrandAppIconVariant = "default" | "maskable";

type BrandAppIconProps = {
  size: number;
  variant?: BrandAppIconVariant;
};

const BRAND_INK = "#1a0812";
const BRAND_CANVAS = "#0b0f14";
const BRAND_GRADIENT = "linear-gradient(145deg, #ff6fb1 0%, #ff9ec8 55%, #ff7eb9 100%)";

function getCornerRadius(iconSize: number): number {
  return Math.round(iconSize * 0.22);
}

function getNoteSize(iconSize: number): number {
  return Math.round(iconSize * 0.56);
}

export function getBrandIconDimensions(size: number) {
  return {
    width: size,
    height: size,
  };
}

export function BrandAppIcon({ size, variant = "default" }: BrandAppIconProps) {
  const safeInset = variant === "maskable" ? Math.round(size * 0.1) : 0;
  const badgeSize = size - safeInset * 2;
  const cornerRadius = getCornerRadius(badgeSize);
  const noteSize = getNoteSize(badgeSize);
  const shadowBlur = Math.max(8, Math.round(size * 0.08));
  const shadowOffset = Math.max(4, Math.round(size * 0.04));

  if (variant === "default" && safeInset === 0) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: cornerRadius,
          background: BRAND_GRADIENT,
          color: BRAND_INK,
          fontSize: noteSize,
          fontWeight: 900,
          boxShadow: `0 ${shadowOffset}px ${shadowBlur}px rgba(255, 111, 177, 0.35)`,
        }}
      >
        ♪
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_CANVAS,
      }}
    >
      <div
        style={{
          width: badgeSize,
          height: badgeSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: cornerRadius,
          background: BRAND_GRADIENT,
          color: BRAND_INK,
          fontSize: noteSize,
          fontWeight: 900,
          boxShadow: `0 ${shadowOffset}px ${shadowBlur}px rgba(255, 111, 177, 0.35)`,
        }}
      >
        ♪
      </div>
    </div>
  );
}
