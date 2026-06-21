import type { Metadata } from "next";

export const SITE_URL = "https://family-jukebox.vercel.app";

export const SITE_NAME = "Family Jukebox";

export const SITE_DESCRIPTION =
  "A clean home for the songs we make together - colorful covers, easy playback, and a live family listening room.";

/** Link preview image for iMessage, texts, social shares */
export const SHARE_IMAGE_PATH = "/og-share.jpg";

export const shareImageMeta = {
  url: SHARE_IMAGE_PATH,
  width: 474,
  height: 1024,
  alt: "Family Jukebox — cousin songs, pink glasses, and family anthems on your phone",
};

export function buildShareMetadata(overrides?: {
  title?: string;
  description?: string;
}): Metadata {
  const title = overrides?.title ?? SITE_NAME;
  const description = overrides?.description ?? SITE_DESCRIPTION;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
      url: SITE_URL,
      images: [shareImageMeta],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE_PATH],
    },
  };
}
