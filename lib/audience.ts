import { getAlbumAuthor, getAlbumSongs, type Album } from "@/data/albums";
import { getMemberBySlug, members, type FamilyMember } from "@/data/members";
import { getSongAuthor, type Song } from "@/data/songs";
import { defaultSubjectMemberSlugs } from "@/lib/copyright-constants";

/** Teens and up hear adult-leaning curations; younger listeners get kid-leaning picks. */
export const ADULT_LISTENER_THRESHOLD = 13;

export type ListenerAgePreset = {
  age: number;
  label: string;
  emoji: string;
  memberSlug?: string;
};

export type FamilyAudienceId = "kids" | "big-kids" | "teens" | "grownups";

export type FamilyAudience = {
  id: FamilyAudienceId;
  label: string;
  age: string;
  emoji: string;
  representativeAge: number;
};

export const FAMILY_AUDIENCES: FamilyAudience[] = [
  {
    id: "kids",
    label: "Kids",
    age: "0–6",
    emoji: "👶",
    representativeAge: 4,
  },
  {
    id: "big-kids",
    label: "Big Kids",
    age: "7–12",
    emoji: "🧒",
    representativeAge: 10,
  },
  {
    id: "teens",
    label: "Teens",
    age: "13–17",
    emoji: "🧑",
    representativeAge: 15,
  },
  {
    id: "grownups",
    label: "Grown-ups",
    age: "18+",
    emoji: "✨",
    representativeAge: 35,
  },
];

export const DEFAULT_FAMILY_AUDIENCE_ID: FamilyAudienceId = "grownups";

const FAMILY_AUDIENCE_BY_ID = new Map(FAMILY_AUDIENCES.map((audience) => [audience.id, audience]));
const DEFAULT_FAMILY_AUDIENCE: FamilyAudience = FAMILY_AUDIENCES.find(
  (audience) => audience.id === DEFAULT_FAMILY_AUDIENCE_ID,
) ?? {
  id: "grownups",
  label: "Grown-ups",
  age: "18+",
  emoji: "✨",
  representativeAge: 35,
};

const KIDS_FRIENDLY_TAGS = new Set([
  "adventure",
  "animals",
  "art",
  "birthday",
  "celebration",
  "colorful",
  "creative",
  "dance",
  "education",
  "educational",
  "energy",
  "family",
  "garden",
  "journey",
  "magic",
  "nature",
  "nursery",
  "school",
  "silly",
  "space",
  "story",
]);

const BIG_KIDS_TAGS = new Set([
  ...KIDS_FRIENDLY_TAGS,
  "adventure",
  "creative",
  "featured",
  "school",
  "sports",
  "tech",
]);

const ADULT_LEANING_TAGS = new Set(["hip-hop", "indie", "kpop", "pop"]);

/** Quick-pick ages anchored to real family members plus a custom option. */
export const LISTENER_AGE_PRESETS: ListenerAgePreset[] = [
  { age: 3, label: "Marceline", emoji: "🌸", memberSlug: "marceline" },
  { age: 6, label: "Eliana", emoji: "💖", memberSlug: "eliana" },
  { age: 8, label: "Solene", emoji: "🎨", memberSlug: "solene" },
  { age: 10, label: "Ocean", emoji: "🌊", memberSlug: "ocean" },
  { age: 35, label: "Grown-up", emoji: "✨", memberSlug: "tio-chien" },
  { age: 40, label: "Sam & Josh", emoji: "🏀", memberSlug: "sam-and-josh" },
];

export function isFamilyAudienceId(value: string): value is FamilyAudienceId {
  return FAMILY_AUDIENCE_BY_ID.has(value as FamilyAudienceId);
}

export function getFamilyAudience(audienceId: FamilyAudienceId): FamilyAudience {
  return FAMILY_AUDIENCE_BY_ID.get(audienceId) ?? DEFAULT_FAMILY_AUDIENCE;
}

export function getAudienceListenerAge(audienceId: FamilyAudienceId): number {
  return getFamilyAudience(audienceId).representativeAge;
}

export function getAudienceIdForListenerAge(listenerAge: number): FamilyAudienceId {
  if (listenerAge <= 6) return "kids";
  if (listenerAge <= 12) return "big-kids";
  if (listenerAge <= 17) return "teens";
  return "grownups";
}

function hasAnyTag(song: Song, tags: ReadonlySet<string>): boolean {
  return song.tags.some((tag) => tags.has(tag));
}

function isAdultAuthoredSong(song: Song): boolean {
  const author = getSongAuthor(song);
  return (author?.age ?? 0) >= 18;
}

export function isSongVisibleForAudience(song: Song, audienceId: FamilyAudienceId): boolean {
  switch (audienceId) {
    case "kids": {
      if (hasAnyTag(song, ADULT_LEANING_TAGS)) {
        return false;
      }
      if (!isAdultAuthoredSong(song)) {
        return true;
      }
      return hasAnyTag(song, KIDS_FRIENDLY_TAGS);
    }
    case "big-kids": {
      if (isAdultAuthoredSong(song) && hasAnyTag(song, ADULT_LEANING_TAGS)) {
        return false;
      }
      if (!isAdultAuthoredSong(song)) {
        return true;
      }
      return hasAnyTag(song, BIG_KIDS_TAGS);
    }
    case "teens":
      return true;
    case "grownups":
      return true;
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}

export function filterSongsForAudience<T extends Song>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  if (audienceId === null) return items;
  if (audienceId === "grownups") return items;
  return items.filter((song) => isSongVisibleForAudience(song, audienceId));
}

export function isAlbumVisibleForAudience(
  album: Album,
  audienceId: FamilyAudienceId | null,
): boolean {
  if (audienceId === null || audienceId === "grownups") return true;
  return getAlbumSongs(album).some((song) => isSongVisibleForAudience(song, audienceId));
}

export function filterAlbumsForAudience<T extends Album>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  if (audienceId === null || audienceId === "grownups") return items;
  return items.filter((album) => isAlbumVisibleForAudience(album, audienceId));
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

export function getListenerAgeLabel(age: number): string {
  const preset = LISTENER_AGE_PRESETS.find((entry) => entry.age === age);
  if (preset) return `${preset.emoji} ${preset.label}`;
  return `Age ${age}`;
}

export function getListenerCurationSubtitle(listenerAge: number): string {
  if (listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return `Curated for age ${listenerAge} — grown-up picks up front, full library always available`;
  }
  return `Curated for age ${listenerAge} — cousin songs your age up front, everything still here`;
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
