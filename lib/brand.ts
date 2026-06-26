export const BRAND_NAME = "Cousin Radio";
export const BRAND_SHORT_NAME = "CR";
export const BRAND_TAGLINE = "Songs for the People We Love";
export const BRAND_SIGNATURE =
  "A family radio station made of love, memories, and tiny anthems.";
export const BRAND_PLAYBACK_LABEL = "Now playing on Cousin Radio";

/**
 * North-star design principles — all-inclusive family creative culture.
 * @see docs/COUSIN-RADIO-DIRECTION.md §3
 */
export const BRAND_DESIGN_PRINCIPLES = [
  {
    id: "everyone-belongs",
    title: "Everyone belongs",
    summary:
      "Every family member with music gets visibility in growing series, hero rotation, and browse — no exclusion.",
  },
  {
    id: "love-and-celebration",
    title: "Love & celebration",
    summary:
      "Spotlight moments honor people and releases; never rank cousins against each other.",
  },
  {
    id: "latest-without-forgetting",
    title: "Latest without forgetting",
    summary:
      "When someone has multiple growing albums, the newest leads the hero; older series stay discoverable.",
  },
  {
    id: "preserve-the-story",
    title: "Preserve the story",
    summary: "Songs carry story, dedication, and memory — not just audio files.",
  },
  {
    id: "open-the-table",
    title: "Open the kitchen table",
    summary: "Share links and play paths should feel like an invitation home: open → see → tap play.",
  },
] as const;

/** UI mark in sidebar / header. */
export const BRAND_LOGO_UI_PATH = "/brand/logo-44.png";

/** Full square logo for large surfaces. */
export const BRAND_LOGO_PATH = "/brand/logo.png";

/** Rounded square app icon for install, favicon, and lock-screen artwork. */
export const BRAND_APP_ICON_PATH = "/brand/app-icon.png";

/** Future logo asset paths — checked in order by BrandWordmark. */
export const BRAND_LOGO_PATHS = {
  horizontal: ["/brand/cousin-radio-logo.svg", "/brand/cousin-radio-logo.png", BRAND_LOGO_PATH],
  icon: ["/brand/cousin-radio-icon.svg", "/brand/cousin-radio-icon.png", BRAND_LOGO_UI_PATH],
  favicon: ["/brand/cousin-radio-favicon.svg", "/favicon.ico"],
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

export function buildNowPlayingArtworkUrl(origin: string, songSlug: string, size: number): string {
  const safeOrigin = origin.replace(/\/$/, "");
  return `${safeOrigin}/api/now-playing-artwork?song=${encodeURIComponent(songSlug)}&size=${size}`;
}
