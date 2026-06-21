import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://family-jukebox.vercel.app";

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return DEFAULT_SITE_URL;

  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export function resolveSiteUrl(env: NodeJS.ProcessEnv = process.env): string {
  const configuredUrl =
    env.NEXT_PUBLIC_SITE_URL ??
    env.VERCEL_URL ??
    env.VERCEL_BRANCH_URL ??
    env.VERCEL_PROJECT_PRODUCTION_URL ??
    DEFAULT_SITE_URL;

  return normalizeSiteUrl(configuredUrl);
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Family Jukebox";

export const SITE_DESCRIPTION =
  "Songs we made together — silly fox trails, pink glasses, gravity shifts, and little family anthems.";

/** Default link preview when no page-specific art is set */
export const SHARE_IMAGE_PATH = "/og-share.jpg";

export type ShareImageMeta = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const defaultShareImage: ShareImageMeta = {
  url: SHARE_IMAGE_PATH,
  width: 474,
  height: 1024,
  alt: "Family Jukebox — cousin songs, pink glasses, and family anthems on your phone",
};

/** Square album art — typical cover size from video extraction */
export const SONG_COVER_SIZE = 1024;

export function buildCoverShareImage(title: string, coverSrc: string): ShareImageMeta {
  return {
    url: coverSrc,
    width: SONG_COVER_SIZE,
    height: SONG_COVER_SIZE,
    alt: `${title} cover art`,
  };
}

export function buildShareMetadata(overrides?: {
  title?: string;
  description?: string;
  /** Path only, e.g. /songs/gravity-shift */
  path?: string;
  image?: ShareImageMeta;
}): Metadata {
  const title = overrides?.title ?? SITE_NAME;
  const description = overrides?.description ?? SITE_DESCRIPTION;
  const pageUrl = overrides?.path ?? "/";
  const image = overrides?.image ?? defaultShareImage;

  return {
    title,
    description,
    alternates: overrides?.path ? { canonical: pageUrl } : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SITE_NAME,
      url: pageUrl,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
