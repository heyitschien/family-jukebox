import { getGrowingSeriesAlbums, type Album } from "@/data/albums";
import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";
import {
  getAlbumSpotlightSong,
  getHeroFeaturedAlbum,
  getRotatedAlbumCarousel,
} from "@/lib/album-rotation";
import { isCelebrationSong } from "@/lib/celebrations";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getRotatedSpotlightSongs,
} from "@/lib/featured-rotation";
import { isNewRelease } from "@/lib/new-releases";

export type HomeFeed = {
  hero: {
    featuredAlbum: Album;
    carouselAlbums: Album[];
    spotlightTrack?: Song;
  };
  newAtTheTable: Song[];
  todaysFamilyPicks: Song[];
  growingWorlds: Album[];
  familyQueue: Song[];
};

const NEW_AT_TABLE_MAX = 6;
const GROWING_WORLDS_MAX = 8;
const GROWING_WORLDS_AUTHOR_CAP = 2;

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

function sortSongsByRecency(songList: Song[]): Song[] {
  return [...songList].sort(
    (a, b) =>
      b.dateCreated.localeCompare(a.dateCreated) || a.title.localeCompare(b.title),
  );
}

function getNewAtTheTableSongs(refreshSeed: number, consumedSongSlugs: Set<string>): Song[] {
  const candidates = sortSongsByRecency(
    songs.filter((song) => isNewRelease(song) || isCelebrationSong(song)),
  );

  if (candidates.length === 0) return [];

  const rotated = rotateArray(candidates, refreshSeed % candidates.length);
  const picked: Song[] = [];

  for (const song of rotated) {
    if (consumedSongSlugs.has(song.slug)) continue;
    picked.push(song);
    consumedSongSlugs.add(song.slug);
    if (picked.length >= NEW_AT_TABLE_MAX) break;
  }

  return picked;
}

function getTodaysFamilyPicks(
  refreshSeed: number,
  consumedSongSlugs: Set<string>,
  heroSpotlightSlug: string | undefined,
  heroAlbumSongSlugs: Set<string>,
): Song[] {
  const spotlight = getRotatedSpotlightSongs(refreshSeed);
  const picked: Song[] = [];
  const pickedAuthors = new Set<string>();

  for (const song of spotlight) {
    if (song.slug === heroSpotlightSlug) continue;
    if (consumedSongSlugs.has(song.slug)) continue;
    if (heroAlbumSongSlugs.has(song.slug)) continue;
    if (pickedAuthors.has(song.authorSlug)) continue;

    picked.push(song);
    pickedAuthors.add(song.authorSlug);
    consumedSongSlugs.add(song.slug);
  }

  return picked;
}

function applyGrowingWorldsAuthorCap(albumList: Album[], max: number, cap: number): Album[] {
  const picked: Album[] = [];
  const authorCounts = new Map<string, number>();
  const deferred: Album[] = [];

  for (const album of albumList) {
    const count = authorCounts.get(album.authorSlug) ?? 0;
    if (count < cap) {
      picked.push(album);
      authorCounts.set(album.authorSlug, count + 1);
      if (picked.length >= max) return picked;
    } else {
      deferred.push(album);
    }
  }

  for (const album of deferred) {
    if (picked.some((entry) => entry.slug === album.slug)) continue;
    picked.push(album);
    if (picked.length >= max) break;
  }

  return picked;
}

function getGrowingWorldsAlbums(
  heroAlbumSlugs: Set<string>,
  consumedAlbumSlugs: Set<string>,
): Album[] {
  const candidates = getGrowingSeriesAlbums().filter(
    (album) => !heroAlbumSlugs.has(album.slug) && !consumedAlbumSlugs.has(album.slug),
  );

  const capped = applyGrowingWorldsAuthorCap(
    candidates,
    GROWING_WORLDS_MAX,
    GROWING_WORLDS_AUTHOR_CAP,
  );

  for (const album of capped) {
    consumedAlbumSlugs.add(album.slug);
  }

  return capped;
}

/** Coordinates homepage sections so each row has one job and content stays deduped. */
export function buildHomeFeed(refreshSeed = createRefreshSeed()): HomeFeed {
  const featuredAlbum = getHeroFeaturedAlbum(refreshSeed);
  const carouselAlbums = getRotatedAlbumCarousel(refreshSeed);
  const spotlightTrack = getAlbumSpotlightSong(featuredAlbum, refreshSeed);

  const heroAlbumSlugs = new Set(carouselAlbums.map((album) => album.slug));
  const heroAlbumSongSlugs = new Set(featuredAlbum.songSlugs);
  const consumedSongSlugs = new Set<string>();
  const consumedAlbumSlugs = new Set<string>(heroAlbumSlugs);

  if (spotlightTrack) {
    consumedSongSlugs.add(spotlightTrack.slug);
  }

  const newAtTheTable = getNewAtTheTableSongs(refreshSeed, consumedSongSlugs);
  const todaysFamilyPicks = getTodaysFamilyPicks(
    refreshSeed,
    consumedSongSlugs,
    spotlightTrack?.slug,
    heroAlbumSongSlugs,
  );
  const growingWorlds = getGrowingWorldsAlbums(heroAlbumSlugs, consumedAlbumSlugs);
  const familyQueue = getFairRotationQueue(refreshSeed);

  return {
    hero: {
      featuredAlbum,
      carouselAlbums,
      spotlightTrack,
    },
    newAtTheTable,
    todaysFamilyPicks,
    growingWorlds,
    familyQueue,
  };
}

/** Members with songs who should appear in family picks over time. */
export function getFamilyPickMemberCount(): number {
  return members.filter((member) =>
    songs.some((song) => song.authorSlug === member.slug),
  ).length;
}

export { createRefreshSeed };
