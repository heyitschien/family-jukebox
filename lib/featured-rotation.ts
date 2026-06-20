import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";

function rotateList<T>(items: T[], startIndex: number): T[] {
  if (items.length === 0) return [];
  const normalizedStart = ((startIndex % items.length) + items.length) % items.length;
  return [...items.slice(normalizedStart), ...items.slice(0, normalizedStart)];
}

/** Day index for fair daily rotation across the family. */
export function getDayIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** One spotlight song per family member — rotates daily through their catalog. */
export function getSpotlightSongPerMember(dayIndex = getDayIndex()): Song[] {
  const day = dayIndex;

  return members
    .map((member) => {
      const memberSongs = songs.filter((song) => song.authorSlug === member.slug);
      if (memberSongs.length === 0) return undefined;
      return memberSongs[day % memberSongs.length];
    })
    .filter((song): song is Song => song !== undefined);
}

/** Shelf order: each member's spotlight first, then the rest. */
export function getRotatedFeaturedShelf(dayIndex = getDayIndex()): Song[] {
  const spotlight = getSpotlightSongPerMember(dayIndex);
  const spotlightSlugs = new Set(spotlight.map((song) => song.slug));
  const rest = songs.filter((song) => !spotlightSlugs.has(song.slug));
  return [...spotlight, ...rest];
}

/** Hero spotlight pool uses the daily shelf order, then rotates per visit. */
export function getHeroRotationPool(dayIndex = getDayIndex()): Song[] {
  return rotateList(getRotatedFeaturedShelf(dayIndex), dayIndex);
}

/** Hero spotlight — rotates daily and can advance through the daily pool on refresh. */
export function getHeroFeaturedSong(visitIndex = 0, dayIndex = getDayIndex()): Song {
  const pool = getHeroRotationPool(dayIndex);
  if (pool.length === 0) return songs[0];
  return pool[visitIndex % pool.length] ?? songs[0];
}

/** Play queue interleaves by author so everyone appears in the mix. */
export function getFairRotationQueue(dayIndex = getDayIndex()): Song[] {
  const day = dayIndex;
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

export function isSpotlightSong(song: Song): boolean {
  return getSpotlightSongPerMember().some((spotlight) => spotlight.slug === song.slug);
}

export function getSpotlightAuthorNames(dayIndex = getDayIndex()): string {
  return getSpotlightSongPerMember(dayIndex)
    .map((song) => members.find((m) => m.slug === song.authorSlug)?.name)
    .filter(Boolean)
    .join(", ");
}
