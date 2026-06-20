import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";

/** Day index for fair daily rotation across the family. */
export function getDayIndex(): number {
  const start = new Date(new Date().getFullYear(), 0, 0);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Request-time seed to vary hero feature on each refresh. */
export function getRefreshSeed(): number {
  return Date.now();
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

/** Hero spotlight — daily base rotation with optional refresh seed offset. */
export function getHeroFeaturedSong(refreshSeed = 0): Song {
  if (songs.length === 0) {
    throw new Error("No songs available for hero rotation");
  }

  const dayOffset = getDayIndex() % songs.length;
  const refreshOffset = Math.abs(Math.trunc(refreshSeed)) % songs.length;
  return songs[(dayOffset + refreshOffset) % songs.length] ?? songs[0];
}

/** Shelf order: each member's spotlight first, then the rest. */
export function getRotatedFeaturedShelf(): Song[] {
  const spotlight = getSpotlightSongPerMember();
  const spotlightSlugs = new Set(spotlight.map((song) => song.slug));
  const rest = songs.filter((song) => !spotlightSlugs.has(song.slug));
  return [...spotlight, ...rest];
}

/** Play queue interleaves by author so everyone appears in the mix. */
export function getFairRotationQueue(): Song[] {
  const day = getDayIndex();
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

export function getSpotlightAuthorNames(): string {
  return getSpotlightSongPerMember()
    .map((song) => members.find((m) => m.slug === song.authorSlug)?.name)
    .filter(Boolean)
    .join(", ");
}
