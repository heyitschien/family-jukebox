export const COUSIN_RADIO_BRAND = {
  name: "Cousin Radio",
  shortName: "Cousin Radio",
  mark: "♪",
  tagline: "Little anthems for the family",
  description:
    "Family songs we made together — silly fox trails, pink glasses, gravity shifts, and little anthems worth replaying.",
  colors: {
    dark: "#0b0f14",
    ink: "#1a0812",
    pink: "#ff6fb1",
    pinkLight: "#ff9ec8",
    sky: "#79d8ff",
    text: "#f8fafc",
    muted: "#cbd5e1",
  },
} as const;

export const COUSIN_RADIO_MEDIA_ARTWORK_PATH = "/media-artwork";

export const COUSIN_RADIO_MEDIA_ARTWORK_SIZES = [96, 128, 192, 256, 384, 512, 1024] as const;

export type CousinRadioArtwork = {
  src: string;
  sizes: string;
  type: "image/png";
};

export function buildCousinRadioArtwork(baseUrl?: string): CousinRadioArtwork[] {
  return COUSIN_RADIO_MEDIA_ARTWORK_SIZES.map((size) => {
    const path = `${COUSIN_RADIO_MEDIA_ARTWORK_PATH}?size=${size}`;
    const src = baseUrl ? new URL(path, baseUrl).href : path;

    return {
      src,
      sizes: `${size}x${size}`,
      type: "image/png",
    };
  });
}
