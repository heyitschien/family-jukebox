import type { MetadataRoute } from "next";

import { buildCousinRadioArtwork, COUSIN_RADIO_BRAND } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COUSIN_RADIO_BRAND.name,
    short_name: COUSIN_RADIO_BRAND.shortName,
    description: COUSIN_RADIO_BRAND.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: COUSIN_RADIO_BRAND.colors.dark,
    theme_color: COUSIN_RADIO_BRAND.colors.pink,
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      ...buildCousinRadioArtwork().map((icon) => ({
        ...icon,
        purpose: "any maskable",
      })),
    ],
  };
}
