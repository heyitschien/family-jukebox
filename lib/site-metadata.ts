import type { Metadata } from "next";

import type { Album } from "@/data/albums";
import type { FamilyMember } from "@/data/members";
import type { Song } from "@/data/songs";

export const SITE_URL = "https://family-jukebox.vercel.app";

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
  url: resolveShareImageUrl(SHARE_IMAGE_PATH),
  width: 474,
  height: 1024,
  alt: "Family Jukebox — cousin songs, pink glasses, and family anthems on your phone",
};

/** Square album art — typical cover size from video extraction */
export const SONG_COVER_SIZE = 1024;

const SHARE_DESCRIPTION_MAX_LENGTH = 200;

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
    return `A family song by ${author.name} — tap to listen on Family Jukebox.`;
  }
  return "A family song worth replaying on Family Jukebox.";
}

export function buildAlbumShareDescription(album: Album, author?: FamilyMember | null): string {
  if (album.subtitle) return trimShareDescription(album.subtitle);
  if (album.story) return trimShareDescription(album.story);
  if (author) {
    return `A family album by ${author.name} — tap to listen on Family Jukebox.`;
  }
  return "A family album worth replaying on Family Jukebox.";
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
