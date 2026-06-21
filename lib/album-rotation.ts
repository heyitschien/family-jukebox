import {
  getPrimaryAlbums,
  type Album,
} from "@/data/albums";
import { members } from "@/data/members";
import { songs } from "@/data/songs";
import { createRefreshSeed, getDayIndex } from "@/lib/featured-rotation";

function getFeaturedAlbums(): Album[] {
  return getPrimaryAlbums().filter((album) => album.featured);
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

/** One primary album per family member — same set as the 3D carousel. */
export function getSpotlightAlbumPerMember(): Album[] {
  return getPrimaryAlbums();
}

/** Hero spotlight album — featured releases first, then daily rotation across primary albums. */
export function getHeroFeaturedAlbum(refreshSeed = 0): Album {
  const featured = getFeaturedAlbums();
  if (featured.length > 0) {
    const index = refreshSeed % featured.length;
    return featured[index] ?? featured[0] ?? buildFallbackAlbum();
  }

  const primary = getPrimaryAlbums();
  if (primary.length === 0) return buildFallbackAlbum();
  const index = (getDayIndex() + refreshSeed) % primary.length;
  return primary[index] ?? primary[0] ?? buildFallbackAlbum();
}

/** 3D carousel — one primary album per artist, no duplicates. */
export function getRotatedAlbumCarousel(refreshSeed = 0): Album[] {
  const primary = getPrimaryAlbums();
  if (primary.length === 0) return [];

  const featured = getFeaturedAlbums();
  const featuredSlugs = new Set(featured.map((album) => album.slug));
  const hero = getHeroFeaturedAlbum(refreshSeed);

  const rest = primary.filter((album) => album.slug !== hero.slug);
  const rotatedRest = rotateArray(rest, getDayIndex() + refreshSeed);

  if (featuredSlugs.has(hero.slug)) {
    return [hero, ...rotatedRest];
  }

  return rotateArray(primary, getDayIndex() + refreshSeed);
}

export function getSpotlightAlbumAuthorNames(): string {
  return getPrimaryAlbums()
    .map((album) => members.find((m) => m.slug === album.authorSlug)?.name)
    .filter(Boolean)
    .join(", ");
}

function buildFallbackAlbum(): Album {
  const firstSong = songs[0];
  return {
    slug: "family-mix",
    kind: "discography",
    title: "Family Mix",
    subtitle: "All our songs",
    authorSlug: firstSong?.authorSlug ?? "ocean",
    coverSrc: firstSong?.coverSrc ?? "/og-share.jpg",
    songSlugs: songs.map((s) => s.slug),
    dateCreated: firstSong?.dateCreated ?? "2026-06-19",
    accentColor: "#ff6fb1",
  };
}

export { createRefreshSeed };
