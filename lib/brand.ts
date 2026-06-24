export const BRAND_NAME = "Cousin Radio";
export const BRAND_SHORT_NAME = "CR";
export const BRAND_TAGLINE = "Little Anthems";
export const BRAND_SIGNATURE = "Little songs. Big connections.";
export const BRAND_PLAYBACK_LABEL = "Now playing on Cousin Radio";

/** UI mark in sidebar / header. */
export const BRAND_LOGO_UI_PATH = "/brand/logo-44.png";

/** Full square logo for large surfaces. */
export const BRAND_LOGO_PATH = "/brand/logo.png";

/** Future logo asset paths — checked in order by BrandWordmark. */
export const BRAND_LOGO_PATHS = {
  horizontal: ["/brand/cousin-radio-logo.svg", "/brand/cousin-radio-logo.png", BRAND_LOGO_PATH],
  icon: ["/brand/cousin-radio-icon.svg", "/brand/cousin-radio-icon.png", BRAND_LOGO_UI_PATH],
  favicon: ["/brand/cousin-radio-favicon.svg", "/brand/favicon.ico"],
} as const;

export const BRAND_CONCEPTS = [
  { label: "Family First", description: "We're in this together.", icon: "users" },
  { label: "Radio Signal", description: "Broadcasting love, everywhere.", icon: "radio" },
  { label: "Music & Joy", description: "The soundtrack of family life.", icon: "music" },
  { label: "Play Together", description: "Press play. Make memories.", icon: "play" },
] as const;

export const BRAND_COLORS = {
  background: "#0b0f14",
  ink: "#060a12",
  surface: "#111827",
  surfaceAlt: "#1a0812",
  pink: "#ff6fb1",
  rose: "#ff8ac8",
  lilac: "#b68cff",
  violet: "#8f7cff",
  ocean: "#6cb7ff",
  accent: "#ff6fb1",
  accentSoft: "#ff9ec8",
  glow: "#ffb8d9",
  mutedLavender: "#b9add6",
  text: "#fff8fb",
  muted: "#b9add6",
} as const;

export function buildBrandArtworkUrl(origin: string, size: number): string {
  const safeOrigin = origin.replace(/\/$/, "");
  return `${safeOrigin}/api/brand-artwork?size=${size}`;
}
