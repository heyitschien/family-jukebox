import type { Metadata } from "next";

const FALLBACK_SITE_URL = "https://family-jukebox-og3z.vercel.app";
const DEPRECATED_SITE_URL = "https://family-jukebox.vercel.app";

export function normalizeSiteUrl(value?: string): string {
  const raw = value?.trim() || FALLBACK_SITE_URL;
  const withProtocol = raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return FALLBACK_SITE_URL;
    }
    url.pathname = "";
    url.search = "";
    url.hash = "";
    const normalized = url.toString().replace(/\/$/, "");
    return normalized === DEPRECATED_SITE_URL ? FALLBACK_SITE_URL : normalized;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL,
);

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
  type?: string;
};

function absoluteSiteUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, SITE_URL).toString();
  }
}

function getImageMimeType(pathOrUrl: string): string | undefined {
  const pathname = pathOrUrl.split("?")[0]?.toLowerCase() ?? "";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".webp")) return "image/webp";
  return undefined;
}

export const defaultShareImage: ShareImageMeta = {
  url: absoluteSiteUrl(SHARE_IMAGE_PATH),
  width: 474,
  height: 1024,
  alt: "Family Jukebox — cousin songs, pink glasses, and family anthems on your phone",
  type: "image/jpeg",
};

/** Square album art — typical cover size from video extraction */
export const SONG_COVER_SIZE = 1024;

export function buildCoverShareImage(title: string, coverSrc: string): ShareImageMeta {
  return {
    url: absoluteSiteUrl(coverSrc),
    width: SONG_COVER_SIZE,
    height: SONG_COVER_SIZE,
    alt: `${title} cover art`,
    type: getImageMimeType(coverSrc),
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
      images: [image.url],
    },
  };
}
