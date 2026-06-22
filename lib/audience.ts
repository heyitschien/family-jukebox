import { getAlbumAuthor, type Album } from "@/data/albums";
import { getMemberBySlug, members, type FamilyMember } from "@/data/members";
import { getSongAuthor, getSongBySlug, type Song } from "@/data/songs";
import { defaultSubjectMemberSlugs } from "@/lib/copyright-constants";

/** Teens and up hear adult-leaning curations; younger listeners get kid-leaning picks. */
export const ADULT_LISTENER_THRESHOLD = 13;

export type FamilyAudienceId = "kids" | "big-kids" | "teens" | "grownups";

export type FamilyAudience = {
  id: FamilyAudienceId;
  label: string;
  age: string;
  emoji: string;
  listenerAge: number;
  summary: string;
  description: string;
};

export const FAMILY_AUDIENCES: FamilyAudience[] = [
  {
    id: "kids",
    label: "Kids",
    age: "0–6",
    emoji: "👶",
    listenerAge: 4,
    summary: "Nursery songs, storytime picks, and extra-safe family favorites.",
    description: "Gentle, playful songs for the youngest listeners in the family.",
  },
  {
    id: "big-kids",
    label: "Big Kids",
    age: "7–12",
    emoji: "🧒",
    listenerAge: 10,
    summary: "Creative adventures, school-night favorites, and family singalongs.",
    description: "Big imagination energy with room for adventures, art, and family fun.",
  },
  {
    id: "teens",
    label: "Teens",
    age: "13–17",
    emoji: "🧑",
    listenerAge: 15,
    summary: "Creator-driven picks, trending family tracks, and newer releases.",
    description: "The mix shifts toward polished singles, creator playlists, and bigger moods.",
  },
  {
    id: "grownups",
    label: "Grown-ups",
    age: "18+",
    emoji: "✨",
    listenerAge: 35,
    summary: "Everything in Cousin Radio, with no filtering.",
    description: "Full access to the entire family catalog, from toddler chaos to late-night singles.",
  },
];

const FAMILY_AUDIENCE_BY_ID = new Map(FAMILY_AUDIENCES.map((audience) => [audience.id, audience]));
const FAMILY_AUDIENCE_ORDER: Record<FamilyAudienceId, number> = {
  kids: 0,
  "big-kids": 1,
  teens: 2,
  grownups: 3,
};

const SONG_MINIMUM_AUDIENCE: Partial<Record<Song["slug"], FamilyAudienceId>> = {
  "dash-and-go": "kids",
  "pink-glasses-everywhere": "kids",
  "foxes-of-the-garden": "kids",
  "three-candles-for-marceline": "kids",
  "pixels-into-magic": "kids",
  "mountains-to-the-shore": "big-kids",
  "gravity-shift": "big-kids",
  "solene-s-painted-trail": "big-kids",
  "crayon-planets": "big-kids",
  "gold-in-the-tile": "big-kids",
  "orange-sweater-sun": "big-kids",
  "miracle-in-the-sand": "teens",
  "tap-on-the-glass": "teens",
  "legacy-in-the-lane": "teens",
  "silver-pan-morning": "grownups",
};

export type ListenerAgePreset = {
  age: number;
  label: string;
  emoji: string;
  memberSlug?: string;
};

/** Compatibility presets for older listener-age UI. */
export const LISTENER_AGE_PRESETS: ListenerAgePreset[] = FAMILY_AUDIENCES.map((audience) => ({
  age: audience.listenerAge,
  label: audience.label,
  emoji: audience.emoji,
}));

export function isFamilyAudienceId(value: string | null | undefined): value is FamilyAudienceId {
  return value === "kids" || value === "big-kids" || value === "teens" || value === "grownups";
}

export function getFamilyAudience(audienceId: FamilyAudienceId): FamilyAudience {
  const audience = FAMILY_AUDIENCE_BY_ID.get(audienceId);
  if (!audience) {
    throw new Error(`Unknown family audience: ${audienceId}`);
  }
  return audience;
}

export function getFamilyAudienceForAge(age: number): FamilyAudienceId {
  if (age <= 6) return "kids";
  if (age <= 12) return "big-kids";
  if (age <= 17) return "teens";
  return "grownups";
}

export function getFamilyAudienceLabel(audienceId: FamilyAudienceId): string {
  const audience = getFamilyAudience(audienceId);
  return `${audience.emoji} ${audience.label}`;
}

export function getFamilyAudienceSubtitle(audienceId: FamilyAudienceId): string {
  return getFamilyAudience(audienceId).summary;
}

export function getFamilyAudienceDescription(audienceId: FamilyAudienceId): string {
  return getFamilyAudience(audienceId).description;
}

export function getSubjectMembers(song: Song): FamilyMember[] {
  const slugs = defaultSubjectMemberSlugs(song.authorSlug, song.slug);
  return slugs
    .map((slug) => getMemberBySlug(slug))
    .filter((member): member is FamilyMember => member !== undefined);
}

function ageProximityBonus(targetAge: number, listenerAge: number, maxPoints: number): number {
  const diff = Math.abs(targetAge - listenerAge);
  return Math.max(0, maxPoints - diff * 4);
}

/**
 * How well a song matches a listener's age for curated surfaces.
 * Higher scores surface first; nothing is hard-blocked from the full library.
 */
export function scoreSongForListener(song: Song, listenerAge: number): number {
  const author = getSongAuthor(song);
  const subjects = getSubjectMembers(song);
  let score = 0;

  if (author) {
    score += ageProximityBonus(author.age, listenerAge, 45);
  }

  for (const subject of subjects) {
    score += ageProximityBonus(subject.age, listenerAge, 20);
  }

  const isAdultListener = listenerAge >= ADULT_LISTENER_THRESHOLD;

  if (isAdultListener) {
    if (author?.role === "tio" || author?.role === "family") {
      score += 35;
    }
    if (author?.role === "girl" || author?.role === "boy") {
      if (author.age < 8) {
        score -= 18;
      }
    }
  } else if (author?.role === "girl" || author?.role === "boy") {
    score += 20;
  } else if (author && author.age > listenerAge + 12) {
    score -= 12;
  }

  return score;
}

export function scoreAlbumForListener(album: Album, listenerAge: number): number {
  const author = getAlbumAuthor(album);
  if (!author) return 0;
  return scoreSongForListener(
    {
      slug: album.slug,
      title: album.title,
      authorSlug: album.authorSlug,
      dateCreated: album.dateCreated,
      audioSrc: "",
      coverSrc: album.coverSrc,
      tags: [],
    },
    listenerAge,
  );
}

/** Reorder items for curation — every item stays in the list. */
export function curateSongsForListener<T extends Song>(items: T[], listenerAge: number): T[] {
  return [...items].sort(
    (a, b) =>
      scoreSongForListener(b, listenerAge) - scoreSongForListener(a, listenerAge) ||
      a.title.localeCompare(b.title),
  );
}

export function curateAlbumsForListener<T extends Album>(items: T[], listenerAge: number): T[] {
  return [...items].sort(
    (a, b) =>
      scoreAlbumForListener(b, listenerAge) - scoreAlbumForListener(a, listenerAge) ||
      a.title.localeCompare(b.title),
  );
}

function audienceRank(audienceId: FamilyAudienceId): number {
  return FAMILY_AUDIENCE_ORDER[audienceId];
}

function compareAudienceVisibility(
  selectedAudienceId: FamilyAudienceId,
  minimumAudienceId: FamilyAudienceId,
): boolean {
  return audienceRank(selectedAudienceId) >= audienceRank(minimumAudienceId);
}

function audienceScoreBonus(
  audienceId: FamilyAudienceId,
  minimumAudienceId: FamilyAudienceId,
): number {
  const selectedRank = audienceRank(audienceId);
  const minimumRank = audienceRank(minimumAudienceId);
  if (minimumRank > selectedRank) return -1000;
  if (minimumRank === selectedRank) return 40;
  return Math.max(8, 28 - (selectedRank - minimumRank) * 9);
}

function inferSongMinimumAudience(song: Song): FamilyAudienceId {
  const explicit = SONG_MINIMUM_AUDIENCE[song.slug];
  if (explicit) return explicit;

  const author = getSongAuthor(song);
  if ((author?.age ?? 99) <= 6) return "kids";
  if ((author?.age ?? 99) <= 12) return "big-kids";
  return "teens";
}

export function getMinimumAudienceForSong(song: Song): FamilyAudienceId {
  return inferSongMinimumAudience(song);
}

export function isSongVisibleForAudience(song: Song, audienceId: FamilyAudienceId): boolean {
  return compareAudienceVisibility(audienceId, getMinimumAudienceForSong(song));
}

export function filterSongsForAudience<T extends Song>(
  items: readonly T[],
  audienceId: FamilyAudienceId,
): T[] {
  return items.filter((song) => isSongVisibleForAudience(song, audienceId));
}

export function scoreSongForAudience(song: Song, audienceId: FamilyAudienceId): number {
  const listenerAge = getFamilyAudience(audienceId).listenerAge;
  return (
    scoreSongForListener(song, listenerAge) +
    audienceScoreBonus(audienceId, getMinimumAudienceForSong(song))
  );
}

export function curateSongsForAudience<T extends Song>(
  items: readonly T[],
  audienceId: FamilyAudienceId,
): T[] {
  return filterSongsForAudience(items, audienceId).sort(
    (a, b) =>
      scoreSongForAudience(b, audienceId) - scoreSongForAudience(a, audienceId) ||
      a.title.localeCompare(b.title),
  );
}

export function getAlbumSongsForAudience<T extends Song>(
  album: Album,
  allSongs: readonly T[],
  audienceId: FamilyAudienceId,
): T[] {
  const albumSongSet = new Set(album.songSlugs);
  return filterSongsForAudience(
    allSongs.filter((song) => albumSongSet.has(song.slug)),
    audienceId,
  );
}

export function isAlbumVisibleForAudience(album: Album, audienceId: FamilyAudienceId): boolean {
  return compareAudienceVisibility(audienceId, getMinimumAudienceForAlbum(album));
}

export function filterAlbumsForAudience<T extends Album>(
  items: readonly T[],
  audienceId: FamilyAudienceId,
): T[] {
  return items.filter((album) => isAlbumVisibleForAudience(album, audienceId));
}

export function scoreAlbumForAudience(album: Album, audienceId: FamilyAudienceId): number {
  const visibleTrackBonus = album.songSlugs.filter((slug) =>
    compareAudienceVisibility(audienceId, getSongMinimumAudienceBySlug(slug)),
  ).length;
  return (
    scoreAlbumForListener(album, getFamilyAudience(audienceId).listenerAge) +
    visibleTrackBonus * 12 +
    audienceScoreBonus(audienceId, getMinimumAudienceForAlbum(album))
  );
}

export function curateAlbumsForAudience<T extends Album>(
  items: readonly T[],
  audienceId: FamilyAudienceId,
): T[] {
  return filterAlbumsForAudience(items, audienceId).sort(
    (a, b) =>
      scoreAlbumForAudience(b, audienceId) - scoreAlbumForAudience(a, audienceId) ||
      a.title.localeCompare(b.title),
  );
}

export function getMinimumAudienceForAlbum(album: Album): FamilyAudienceId {
  return album.songSlugs.reduce<FamilyAudienceId | null>((current, slug) => {
    const next = getSongMinimumAudienceBySlug(slug);
    if (current === null) return next;
    return audienceRank(next) < audienceRank(current) ? next : current;
  }, null) ?? "grownups";
}

function getSongMinimumAudienceBySlug(songSlug: string): FamilyAudienceId {
  const explicit = SONG_MINIMUM_AUDIENCE[songSlug];
  if (explicit) return explicit;

  const song = getSongBySlug(songSlug);
  if (!song) return "grownups";
  return inferSongMinimumAudience(song);
}

export function getVisibleTagsForAudience(items: readonly Song[], audienceId: FamilyAudienceId): string[] {
  return Array.from(
    new Set(filterSongsForAudience(items, audienceId).flatMap((song) => song.tags)),
  ).sort((a, b) => a.localeCompare(b));
}

export function getListenerAgeLabel(age: number): string {
  const preset = LISTENER_AGE_PRESETS.find((entry) => entry.age === age);
  if (preset) return `${preset.emoji} ${preset.label}`;
  return `Age ${age}`;
}

export function getListenerCurationSubtitle(listenerAge: number): string {
  const audienceId = getFamilyAudienceForAge(listenerAge);
  const audience = getFamilyAudience(audienceId);
  if (audience.listenerAge === listenerAge) {
    return audience.summary;
  }
  if (listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return `Curated for age ${listenerAge} — grown-up picks up front, full library always available`;
  }
  return `Curated for age ${listenerAge} — cousin songs your age up front, everything still here`;
}

export function isValidListenerAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 120;
}

export function getPresetForMemberSlug(memberSlug: string): ListenerAgePreset | undefined {
  const member = getMemberBySlug(memberSlug);
  if (!member) return undefined;

  const audience = getFamilyAudience(getFamilyAudienceForAge(member.age));
  return {
    age: audience.listenerAge,
    label: audience.label,
    emoji: audience.emoji,
    memberSlug,
  };
}

export function getNearestPresetAge(age: number): number {
  const presetAges = LISTENER_AGE_PRESETS.map((preset) => preset.age);
  return presetAges.reduce((nearest, candidate) =>
    Math.abs(candidate - age) < Math.abs(nearest - age) ? candidate : nearest,
  );
}

export function getFamilyMembersForListenerAge(listenerAge: number): FamilyMember[] {
  return members.filter((member) => Math.abs(member.age - listenerAge) <= 8);
}
