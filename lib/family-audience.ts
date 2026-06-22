import { getAlbumSongs, type Album } from "@/data/albums";
import { type FamilyMember, type MemberRole } from "@/data/members";
import { getSongAuthor, type Song } from "@/data/songs";
import { curateAlbumsForListener, curateSongsForListener } from "@/lib/audience";

export type FamilyAudienceId = "kids" | "big-kids" | "teens" | "grownups";

export type FamilyAudience = {
  id: FamilyAudienceId;
  label: string;
  age: string;
  emoji: string;
};

export const FAMILY_AUDIENCES: FamilyAudience[] = [
  { id: "kids", label: "Kids", age: "0–6", emoji: "👶" },
  { id: "big-kids", label: "Big Kids", age: "7–12", emoji: "🧒" },
  { id: "teens", label: "Teens", age: "13–17", emoji: "🧑" },
  { id: "grownups", label: "Grown-ups", age: "18+", emoji: "✨" },
];

const MATURE_TAGS = new Set(["hip-hop", "fathers-day"]);
const KID_FRIENDLY_TAGS = new Set([
  "silly",
  "dance",
  "energy",
  "animals",
  "garden",
  "story",
  "art",
  "color",
  "birthday",
  "celebration",
  "adventure",
  "nature",
  "journey",
  "creative",
  "magic",
  "space",
]);

export function isValidFamilyAudienceId(value: string): value is FamilyAudienceId {
  return FAMILY_AUDIENCES.some((audience) => audience.id === value);
}

export function getFamilyAudience(id: FamilyAudienceId): FamilyAudience {
  const audience = FAMILY_AUDIENCES.find((entry) => entry.id === id);
  if (audience) return audience;
  return FAMILY_AUDIENCES[FAMILY_AUDIENCES.length - 1]!;
}

/** Representative listener age for soft curation boosts. */
export function getListenerAgeForAudience(audienceId: FamilyAudienceId): number {
  switch (audienceId) {
    case "kids":
      return 3;
    case "big-kids":
      return 10;
    case "teens":
      return 15;
    case "grownups":
      return 35;
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}

export function getAudienceForListenerAge(age: number): FamilyAudienceId {
  if (age <= 6) return "kids";
  if (age <= 12) return "big-kids";
  if (age <= 17) return "teens";
  return "grownups";
}

function hasTag(tags: string[], target: string): boolean {
  return tags.some((tag) => tag.toLowerCase() === target);
}

function hasAnyTag(tags: string[], targets: Set<string>): boolean {
  return tags.some((tag) => targets.has(tag.toLowerCase()));
}

function isKidAuthor(author: FamilyMember | undefined): boolean {
  return author?.role === "girl" || author?.role === "boy";
}

function isAdultAuthor(author: FamilyMember | undefined): boolean {
  if (!author) return false;
  return author.age >= 18 || author.role === "tio" || author.role === "family";
}

function isMatureAdultSong(song: Song, author: FamilyMember | undefined): boolean {
  const tags = song.tags.map((tag) => tag.toLowerCase());
  if (hasAnyTag(tags, MATURE_TAGS)) return true;
  if (author?.role === "family" && author.age >= 35 && hasTag(tags, "indie")) return true;
  return false;
}

function isToddlerSong(author: FamilyMember | undefined): boolean {
  return Boolean(author && author.age <= 3);
}

function isFamilyCreativeSong(song: Song, author: FamilyMember | undefined): boolean {
  const tags = song.tags.map((tag) => tag.toLowerCase());
  if (hasAnyTag(tags, KID_FRIENDLY_TAGS)) return true;
  if (author && (author.role === "tio" || author.role === "family") && hasTag(tags, "creative")) {
    return true;
  }
  return isKidAuthor(author);
}

/**
 * Hard visibility gate for family audience profiles.
 * Grown-ups see the full catalog; younger audiences hide mature material.
 */
export function isSongVisibleForAudience(song: Song, audienceId: FamilyAudienceId): boolean {
  if (audienceId === "grownups") return true;

  const author = getSongAuthor(song);
  const tags = song.tags.map((tag) => tag.toLowerCase());

  switch (audienceId) {
    case "kids": {
      if (isMatureAdultSong(song, author)) return false;
      if (isAdultAuthor(author) && !hasAnyTag(tags, KID_FRIENDLY_TAGS)) return false;
      return true;
    }
    case "big-kids": {
      if (isMatureAdultSong(song, author)) return false;
      return isFamilyCreativeSong(song, author) || isKidAuthor(author) || author?.role === "tio";
    }
    case "teens": {
      if (isToddlerSong(author) && !hasTag(tags, "birthday")) return false;
      return true;
    }
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}

export function isAlbumVisibleForAudience(album: Album, audienceId: FamilyAudienceId): boolean {
  if (audienceId === "grownups") return true;
  const albumSongs = getAlbumSongs(album);
  return albumSongs.some((song) => isSongVisibleForAudience(song, audienceId));
}

export function isMemberVisibleForAudience(member: FamilyMember, audienceId: FamilyAudienceId): boolean {
  if (audienceId === "grownups") return true;

  switch (audienceId) {
    case "kids":
      return member.role === "girl" || member.role === "boy" || member.role === "tio";
    case "big-kids":
      return member.role !== "family" || member.age < 35;
    case "teens":
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
  if (!audienceId || audienceId === "grownups") return items;
  return items.filter((song) => isSongVisibleForAudience(song, audienceId));
}

export function filterAlbumsForAudience<T extends Album>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  if (!audienceId || audienceId === "grownups") return items;
  return items.filter((album) => isAlbumVisibleForAudience(album, audienceId));
}

/** Filter then reorder for the active family audience. */
export function curateSongsForAudience<T extends Song>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  const visible = filterSongsForAudience(items, audienceId);
  if (!audienceId) return visible;
  return curateSongsForListener(visible, getListenerAgeForAudience(audienceId));
}

export function curateAlbumsForAudience<T extends Album>(
  items: T[],
  audienceId: FamilyAudienceId | null,
): T[] {
  const visible = filterAlbumsForAudience(items, audienceId);
  if (!audienceId) return visible;
  return curateAlbumsForListener(visible, getListenerAgeForAudience(audienceId));
}

export function getAudienceCurationSubtitle(audienceId: FamilyAudienceId): string {
  const audience = getFamilyAudience(audienceId);
  if (audienceId === "grownups") {
    return `${audience.emoji} ${audience.label} — the full Cousin Radio catalog`;
  }
  return `${audience.emoji} ${audience.label} (${audience.age}) — music picked for your family`;
}

export function getAudienceLabel(audienceId: FamilyAudienceId): string {
  const audience = getFamilyAudience(audienceId);
  return `${audience.emoji} ${audience.label}`;
}

export function getRoleAudienceFit(role: MemberRole, audienceId: FamilyAudienceId): number {
  switch (audienceId) {
    case "kids":
      return role === "girl" || role === "boy" ? 2 : role === "tio" ? 1 : 0;
    case "big-kids":
      return role === "girl" || role === "boy" || role === "tio" ? 2 : 1;
    case "teens":
      return role === "family" || role === "tio" ? 2 : 1;
    case "grownups":
      return 2;
    default: {
      const _exhaustive: never = audienceId;
      return _exhaustive;
    }
  }
}
