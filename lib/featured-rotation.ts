import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";
import { getCelebrationSongSlugs } from "@/lib/celebrations";

/** Day index for fair daily rotation across the family. */
export function getDayIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Per-request seed so the hero changes on every refresh while staying daily-fair. */
export function createRefreshSeed(): number {
  return Math.floor(Math.random() * 10_000);
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

/** One spotlight song per family member — rotates daily through their catalog. */
export function getSpotlightSongPerMember(): Song[] {
  const day = getDayIndex();

  return members
    .map((member) => {
      const memberSongs = songs.filter((song) => song.authorSlug === member.slug);
      if (memberSongs.length === 0) return undefined;
      return memberSongs[day % memberSongs.length];
    })
    .filter((song): song is Song => song !== undefined);
}

/** Hero spotlight — rotates daily and shifts on each page refresh. */
export function getHeroFeaturedSong(refreshSeed = 0): Song {
  const spotlight = getSpotlightSongPerMember();
  if (spotlight.length === 0) return songs[0];
  const index = (getDayIndex() + refreshSeed) % spotlight.length;
  return spotlight[index] ?? songs[0];
}

/** Shelf order: today's celebrations first, then each member's spotlight, then the rest. */
export function getRotatedFeaturedShelf(refreshSeed = 0): Song[] {
  const celebrationSlugs = new Set(getCelebrationSongSlugs());
  const celebrationSongs = songs.filter((song) => celebrationSlugs.has(song.slug));

  const spotlight = getSpotlightSongPerMember().filter((song) => !celebrationSlugs.has(song.slug));
  const spotlightSlugs = new Set([...celebrationSlugs, ...spotlight.map((song) => song.slug)]);
  const rest = songs.filter((song) => !spotlightSlugs.has(song.slug));
  const rotatedSpotlight = rotateArray(spotlight, getDayIndex() + refreshSeed);
  const rotatedRest = rotateArray(rest, refreshSeed);
  return [...celebrationSongs, ...rotatedSpotlight, ...rotatedRest];
}

/** Play queue interleaves by author — celebration songs lead on special days. */
export function getFairRotationQueue(refreshSeed = 0): Song[] {
  const celebrationSlugs = getCelebrationSongSlugs();
  const celebrationSongs = songs.filter((song) => celebrationSlugs.includes(song.slug));
  if (celebrationSongs.length > 0) {
    const celebrationQueue = [...celebrationSongs];
    const remaining = getFairRotationQueueInternal(refreshSeed).filter(
      (song) => !celebrationSlugs.includes(song.slug),
    );
    return [...celebrationQueue, ...remaining];
  }
  return getFairRotationQueueInternal(refreshSeed);
}

function getFairRotationQueueInternal(refreshSeed = 0): Song[] {
  const day = getDayIndex() + refreshSeed;
  const byMember = new Map<string, Song[]>();

  for (const song of songs) {
    const list = byMember.get(song.authorSlug) ?? [];
    list.push(song);
    byMember.set(song.authorSlug, list);
  }

  const orderedMembers = [...members.slice(day % members.length), ...members.slice(0, day % members.length)];
  const queue: Song[] = [];
  let added = true;

  while (added) {
    added = false;
    for (const member of orderedMembers) {
      const list = byMember.get(member.slug);
      const next = list?.shift();
      if (next) {
        queue.push(next);
        added = true;
      }
    }
  }

  return queue.length > 0 ? queue : [...songs];
}

export function getRotatedSpotlightSongs(refreshSeed = 0): Song[] {
  return rotateArray(getSpotlightSongPerMember(), getDayIndex() + refreshSeed);
}

export function isSpotlightSong(song: Song): boolean {
  return getSpotlightSongPerMember().some((spotlight) => spotlight.slug === song.slug);
}

export function getSpotlightAuthorNames(): string {
  return getSpotlightSongPerMember()
    .map((song) => members.find((m) => m.slug === song.authorSlug)?.name)
    .filter(Boolean)
    .join(", ");
}
