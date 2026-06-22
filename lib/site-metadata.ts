import type { Metadata } from "next";

import type { Album } from "@/data/albums";
import type { FamilyMember } from "@/data/members";
import type { Song } from "@/data/songs";

const DEFAULT_SITE_URL = "https://cousinradio.com";

/** Canonical public origin for OG tags, canonical URLs, and sitemap. */
export function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Cousin Radio";

export const SITE_DESCRIPTION =
  "Family songs we made together — silly fox trails, pink glasses, gravity shifts, and little anthems worth replaying.";

/** Default link preview when no page-specific art is set (Next.js file route). */
export const SHARE_IMAGE_PATH = "/opengraph-image";

export const SHARE_IMAGE_SIZE = {
  width: 1200,
  height: 630,
} as const;

export type ShareImageMeta = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export const defaultShareImage: ShareImageMeta = {
  url: resolveShareImageUrl(SHARE_IMAGE_PATH),
  width: SHARE_IMAGE_SIZE.width,
  height: SHARE_IMAGE_SIZE.height,
  alt: "Cousin Radio — family songs, pink glasses, and little anthems",
};

/** Square album art — typical cover size from video extraction */
export const SONG_COVER_SIZE = 1024;

const SHARE_DESCRIPTION_MAX_LENGTH = 200;

export function formatPageTitle(pageTitle: string): string {
  return `${pageTitle} · ${SITE_NAME}`;
}

export function resolveShareImageUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }

  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

function trimShareDescription(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= SHARE_DESCRIPTION_MAX_LENGTH) {
    return normalized;
  }

  return `${normalized.slice(0, SHARE_DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`;
}

export function buildSongShareDescription(song: Song, author?: FamilyMember | null): string {
  if (song.subtitle) return trimShareDescription(song.subtitle);
  if (song.story) return trimShareDescription(song.story);
  if (author) {
    return `A family song by ${author.name} — tap to listen on Cousin Radio.`;
  }
  return "A family song worth replaying on Cousin Radio.";
}

export function buildAlbumShareDescription(album: Album, author?: FamilyMember | null): string {
  if (album.subtitle) return trimShareDescription(album.subtitle);
  if (album.story) return trimShareDescription(album.story);
  if (author) {
    return `A family album by ${author.name} — tap to listen on Cousin Radio.`;
  }
  return "A family album worth replaying on Cousin Radio.";
}

export function buildCoverShareImage(title: string, coverSrc: string): ShareImageMeta {
  return {
    url: resolveShareImageUrl(coverSrc),
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
  const pageUrl = overrides?.path ? `${SITE_URL}${overrides.path}` : SITE_URL;
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
      locale: "en_US",
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
