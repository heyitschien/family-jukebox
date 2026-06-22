import { getAlbumAuthor, getAlbumSongs, type Album } from "@/data/albums";
import { getMemberBySlug, members, type FamilyMember } from "@/data/members";
import { getSongAuthor, type Song } from "@/data/songs";
import { defaultSubjectMemberSlugs } from "@/lib/copyright-constants";

export type FamilyAudienceId = "kids" | "big-kids" | "teens" | "grownups";

export type FamilyAudience = {
  id: FamilyAudienceId;
  label: string;
  age: string;
  emoji: string;
  tagline: string;
};

export const audiences: FamilyAudience[] = [
  {
    id: "kids",
    label: "Kids",
    age: "0-6",
    emoji: "👶",
    tagline: "Nursery songs, stories, birthdays, and gentle family music.",
  },
  {
    id: "big-kids",
    label: "Big Kids",
    age: "7-12",
    emoji: "🧒",
    tagline: "Adventure songs, creative ideas, school-day energy, and family fun.",
  },
  {
    id: "teens",
    label: "Teens",
    age: "13-17",
    emoji: "🧑",
    tagline: "Creator playlists, trending family songs, and bigger-kid discoveries.",
  },
  {
    id: "grownups",
    label: "Grown-ups",
    age: "18+",
    emoji: "✨",
    tagline: "The full Cousin Radio catalog with no filtering.",
  },
];

export const DEFAULT_FAMILY_AUDIENCE_ID: FamilyAudienceId = "grownups";

/** Teens and up hear adult-leaning curations; younger listeners get kid-leaning picks. */
export const ADULT_LISTENER_THRESHOLD = 13;

export type ListenerAgePreset = {
  age: number;
  label: string;
  emoji: string;
  memberSlug?: string;
};

/** Quick-pick ages anchored to real family members plus a custom option. */
export const LISTENER_AGE_PRESETS: ListenerAgePreset[] = [
  { age: 3, label: "Marceline", emoji: "🌸", memberSlug: "marceline" },
  { age: 6, label: "Eliana", emoji: "💖", memberSlug: "eliana" },
  { age: 8, label: "Solene", emoji: "🎨", memberSlug: "solene" },
  { age: 10, label: "Ocean", emoji: "🌊", memberSlug: "ocean" },
  { age: 35, label: "Adults", emoji: "✨", memberSlug: "tio-chien" },
  { age: 40, label: "Sam & Josh", emoji: "🏀", memberSlug: "sam-and-josh" },
];

const KID_SAFE_TAGS = new Set([
  "animals",
  "art",
  "birthday",
  "celebration",
  "color",
  "colorful",
  "dance",
  "garden",
  "journey",
  "nature",
  "silly",
  "story",
]);

const BIG_KID_TAGS = new Set([
  ...KID_SAFE_TAGS,
  "adventure",
  "creative",
  "energy",
  "magic",
  "space",
  "tech",
]);

const CREATOR_AUDIENCE_ROLES = new Set<FamilyMember["role"]>(["girl", "boy"]);

export function isFamilyAudienceId(value: string | null | undefined): value is FamilyAudienceId {
  return audiences.some((audience) => audience.id === value);
}

export function getFamilyAudience(id: FamilyAudienceId | null | undefined): FamilyAudience | null {
  if (!id) return null;
  return audiences.find((audience) => audience.id === id) ?? null;
}

export function getAudienceListenerAge(id: FamilyAudienceId): number {
  switch (id) {
    case "kids":
      return 3;
    case "big-kids":
      return 9;
    case "teens":
      return 15;
    case "grownups":
      return 35;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
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

export function scoreSongForAudience(song: Song, audienceId: FamilyAudienceId): number {
  if (!isSongVisibleForAudience(song, audienceId)) return -1_000;
  return scoreSongForListener(song, getAudienceListenerAge(audienceId));
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

export function scoreAlbumForAudience(album: Album, audienceId: FamilyAudienceId): number {
  if (!isAlbumVisibleForAudience(album, audienceId)) return -1_000;
  return scoreAlbumForListener(album, getAudienceListenerAge(audienceId));
}

/** Reorder items for legacy age-based curation — every item stays in the list. */
export function curateSongsForListener<T extends Song>(items: T[], listenerAge: number): T[] {
  return [...items].sort(
    (a, b) =>
      scoreSongForListener(b, listenerAge) - scoreSongForListener(a, listenerAge) ||
      a.title.localeCompare(b.title),
  );
}

export function curateSongsForAudience<T extends Song>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  if (audienceId === null) return items;
  if (audienceId === "grownups") {
    return curateSongsForListener(items, getAudienceListenerAge(audienceId));
  }

  return items
    .filter((song) => isSongVisibleForAudience(song, audienceId))
    .sort(
      (a, b) =>
        scoreSongForAudience(b, audienceId) - scoreSongForAudience(a, audienceId) ||
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

export function curateAlbumsForAudience<T extends Album>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  if (audienceId === null) return items;
  if (audienceId === "grownups") {
    return curateAlbumsForListener(items, getAudienceListenerAge(audienceId));
  }

  return items
    .map((album) => filterAlbumForAudience(album, audienceId))
    .filter((album): album is T => album !== null)
    .sort(
      (a, b) =>
        scoreAlbumForAudience(b, audienceId) - scoreAlbumForAudience(a, audienceId) ||
        a.title.localeCompare(b.title),
    );
}

export function isMemberVisibleForAudience(
  member: FamilyMember,
  audienceId: FamilyAudienceId | null | undefined,
): boolean {
  if (!audienceId || audienceId === "grownups") return true;

  switch (audienceId) {
    case "kids":
      return member.age <= 6;
    case "big-kids":
      return member.age >= 7 && member.age <= 12;
    case "teens":
      return CREATOR_AUDIENCE_ROLES.has(member.role) && member.age >= 7;
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}

export function isSongVisibleForAudience(
  song: Song,
  audienceId: FamilyAudienceId | null | undefined,
): boolean {
  if (!audienceId || audienceId === "grownups") return true;

  const author = getSongAuthor(song);
  const authorAge = author?.age ?? 120;
  const authorRole = author?.role;
  const tagSet = new Set(song.tags);
  const hasKidSafeTag = song.tags.some((tag) => KID_SAFE_TAGS.has(tag));
  const hasBigKidTag = song.tags.some((tag) => BIG_KID_TAGS.has(tag));

  switch (audienceId) {
    case "kids":
      return authorAge <= 6 || (hasKidSafeTag && authorRole !== "family" && authorRole !== "tio");
    case "big-kids":
      return authorAge <= 12 || hasBigKidTag;
    case "teens":
      return (
        CREATOR_AUDIENCE_ROLES.has(authorRole ?? "family") ||
        tagSet.has("featured") ||
        tagSet.has("celebration")
      );
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}

export function isAlbumVisibleForAudience(
  album: Album,
  audienceId: FamilyAudienceId | null | undefined,
): boolean {
  if (!audienceId || audienceId === "grownups") return true;
  return getAlbumSongs(album).some((song) => isSongVisibleForAudience(song, audienceId));
}

export function filterAlbumForAudience<T extends Album>(
  album: T,
  audienceId: FamilyAudienceId | null,
): T | null {
  if (audienceId === null || audienceId === "grownups") return album;

  const visibleSlugs = getAlbumSongs(album)
    .filter((song) => isSongVisibleForAudience(song, audienceId))
    .map((song) => song.slug);

  if (visibleSlugs.length === 0) return null;
  return { ...album, songSlugs: visibleSlugs };
}

export function getListenerAgeLabel(age: number): string {
  const preset = LISTENER_AGE_PRESETS.find((entry) => entry.age === age);
  if (preset) return `${preset.emoji} ${preset.label}`;
  return `Age ${age}`;
}

export function getAudienceCurationSubtitle(audienceId: FamilyAudienceId | null): string {
  const audience = getFamilyAudience(audienceId);
  if (!audience) {
    return "Choose who is listening to shape songs, playlists, search, and recommendations.";
  }

  if (audience.id === "grownups") {
    return "Grown-ups see the full Cousin Radio catalog with no filtering.";
  }

  return `${audience.label} (${audience.age}) see age-aware songs, playlists, and family recommendations.`;
}

export function getListenerCurationSubtitle(listenerAge: number): string {
  return getAudienceCurationSubtitle(
    listenerAge >= ADULT_LISTENER_THRESHOLD ? "grownups" : "kids",
  );
}

export function isValidListenerAge(age: number): boolean {
  return Number.isInteger(age) && age >= 1 && age <= 120;
}

export function getPresetForMemberSlug(memberSlug: string): ListenerAgePreset | undefined {
  return LISTENER_AGE_PRESETS.find((preset) => preset.memberSlug === memberSlug);
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
