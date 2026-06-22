export const BRAND_NAME = "Cousin Radio";
export const BRAND_SHORT_NAME = "CR";
export const BRAND_TAGLINE = "Little Anthems";
export const BRAND_PLAYBACK_LABEL = "Now playing on Cousin Radio";

export const BRAND_COLORS = {
  background: "#0b0f14",
  surface: "#111827",
  surfaceAlt: "#1a0812",
  accent: "#ff6fb1",
  accentSoft: "#ff9ec8",
  glow: "#ffd166",
  text: "#fff8fb",
  muted: "#cbd5e1",
} as const;

export function buildBrandArtworkUrl(origin: string, size: number): string {
  const safeOrigin = origin.replace(/\/$/, "");
  return `${safeOrigin}/api/brand-artwork?size=${size}`;
}
