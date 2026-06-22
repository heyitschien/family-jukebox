import {
  getAllAlbums,
  getAlbumSongs,
  getPrimaryAlbums,
  type Album,
} from "@/data/albums";
import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";
import {
  getCelebrationAlbumSlugs,
  getCelebrationHeroBadge,
} from "@/lib/celebrations";
import { createRefreshSeed, getDayIndex } from "@/lib/featured-rotation";

function getFeaturedAlbums(): Album[] {
  return getPrimaryAlbums().filter((album) => album.featured);
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Album tracks sorted newest-first — used for cover rotation and spotlight picks. */
export function getAlbumSongsByRecency(album: Album): Song[] {
  const trackOrder = new Map(album.songSlugs.map((slug, index) => [slug, index]));

  return [...getAlbumSongs(album)].sort((a, b) => {
    const dateCmp = b.dateCreated.localeCompare(a.dateCreated);
    if (dateCmp !== 0) return dateCmp;

    const trackCmp = (trackOrder.get(b.slug) ?? 0) - (trackOrder.get(a.slug) ?? 0);
    if (trackCmp !== 0) return trackCmp;

    return a.title.localeCompare(b.title);
  });
}

/** Daily spotlight track within a multi-song album (latest-first ordering). */
export function getAlbumSpotlightSongIndex(album: Album, refreshSeed = 0): number {
  const recencySongs = getAlbumSongsByRecency(album);
  if (recencySongs.length <= 1) return 0;
  return (getDayIndex() + refreshSeed + hashSlug(album.slug)) % recencySongs.length;
}

export function getAlbumSpotlightSong(album: Album, refreshSeed = 0): Song | undefined {
  const recencySongs = getAlbumSongsByRecency(album);
  const index = getAlbumSpotlightSongIndex(album, refreshSeed);
  return recencySongs[index];
}

/** Map album slug → spotlight song for the current refresh seed. */
export function getAlbumSpotlightSongMap(
  albumList: Album[],
  refreshSeed = 0,
): Map<string, Song | undefined> {
  return new Map(
    albumList.map((album) => [album.slug, getAlbumSpotlightSong(album, refreshSeed)]),
  );
}

/** One primary album per family member — same set as the 3D carousel. */
export function getSpotlightAlbumPerMember(): Album[] {
  return getPrimaryAlbums();
}

function getCelebrationAlbums(): Album[] {
  const slugs = new Set(getCelebrationAlbumSlugs());
  if (slugs.size === 0) return [];
  return getAllAlbums().filter((album) => slugs.has(album.slug));
}

/** Hero spotlight album — today's celebrations first, then featured releases, then daily rotation. */
export function getHeroFeaturedAlbum(refreshSeed = 0): Album {
  const celebrations = getCelebrationAlbums();
  if (celebrations.length > 0) {
    const index = refreshSeed % celebrations.length;
    return celebrations[index] ?? celebrations[0] ?? buildFallbackAlbum();
  }

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

/** 3D carousel — celebration albums first, then one primary album per artist. */
export function getRotatedAlbumCarousel(refreshSeed = 0): Album[] {
  const primary = getPrimaryAlbums();
  if (primary.length === 0) return [];

  const celebrationSlugs = new Set(getCelebrationAlbumSlugs());
  const hero = getHeroFeaturedAlbum(refreshSeed);

  if (celebrationSlugs.size > 0) {
    const celebrationPrimary = primary.filter((album) => celebrationSlugs.has(album.slug));
    const rest = primary.filter(
      (album) => album.slug !== hero.slug && !celebrationSlugs.has(album.slug),
    );
    const rotatedRest = rotateArray(rest, getDayIndex() + refreshSeed);
    const otherCelebrations = celebrationPrimary.filter((album) => album.slug !== hero.slug);
    return [hero, ...otherCelebrations, ...rotatedRest];
  }

  const featured = getFeaturedAlbums();
  const featuredSlugs = new Set(featured.map((album) => album.slug));

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

export type AlbumHeroBadge = {
  emoji: string;
  prefix: string;
};

/** Unified hero badge — celebration, featured release, today's front pick, or collection browse. */
export function getAlbumHeroBadge(album: Album, heroAlbum: Album): AlbumHeroBadge {
  const celebrationBadge = getCelebrationHeroBadge(album);
  if (celebrationBadge) {
    return celebrationBadge;
  }
  if (album.featured) {
    return { emoji: "💛", prefix: "Featured release · " };
  }
  if (album.slug === heroAlbum.slug) {
    return { emoji: "✨", prefix: "Today's spotlight · " };
  }
  return { emoji: "🎵", prefix: "From the collection · " };
}

export function isTodayHeroAlbum(album: Album, refreshSeed = 0): boolean {
  return getHeroFeaturedAlbum(refreshSeed).slug === album.slug;
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
