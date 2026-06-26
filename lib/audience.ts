import { getAlbumAuthor, getAlbumSongs, type Album } from "@/data/albums";
import { getMemberBySlug, members, type FamilyMember, isAdultFamilyMember } from "@/data/members";
import { getSongAuthor, type Song } from "@/data/songs";
import { defaultSubjectMemberSlugs } from "@/lib/copyright-constants";
import { getDayIndex } from "@/lib/featured-rotation";

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
  { age: 35, label: "Grown-up", emoji: "✨", memberSlug: "tio-chien" },
  { age: 40, label: "Tio Sam & Tio Josh", emoji: "🏀", memberSlug: "sam-and-josh" },
  { age: 55, label: "Mama", emoji: "🏡", memberSlug: "maria" },
];

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

function getAuthorAgeForCuration(author: FamilyMember, listenerAge: number): number {
  if (isAdultFamilyMember(author) && listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return listenerAge;
  }
  return author.age;
}

/** Age filter chips: kid ages match exactly; grown-up buckets (13+) include all adult family artists. */
export function memberMatchesAgeFilter(
  member: FamilyMember | undefined,
  filterAge: number | null | undefined,
): boolean {
  if (filterAge == null) return true;
  if (!member) return false;
  if (filterAge >= ADULT_LISTENER_THRESHOLD && isAdultFamilyMember(member)) {
    return true;
  }
  return member.age === filterAge;
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
    score += ageProximityBonus(getAuthorAgeForCuration(author, listenerAge), listenerAge, 45);
  }

  for (const subject of subjects) {
    score += ageProximityBonus(getAuthorAgeForCuration(subject, listenerAge), listenerAge, 20);
  }

  const isAdultListener = listenerAge >= ADULT_LISTENER_THRESHOLD;

  if (isAdultListener) {
    if (author && isAdultFamilyMember(author)) {
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
  const albumSongs = getAlbumSongs(album);
  if (albumSongs.length === 0) {
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

  const songScores = albumSongs.map((song) => scoreSongForListener(song, listenerAge));
  const peak = Math.max(...songScores);
  const average = songScores.reduce((sum, score) => sum + score, 0) / songScores.length;
  return peak * 0.65 + average * 0.35;
}

/**
 * Pick one album from candidates using soft audience scoring.
 * Seed + day index break ties so rotation stays fair over time.
 */
export function pickAudienceAwareAlbum(
  candidates: Album[],
  listenerAge: number,
  refreshSeed = 0,
  fallback?: Album,
): Album {
  if (candidates.length === 0) {
    return fallback ?? candidates[0]!;
  }
  if (candidates.length === 1) {
    return candidates[0]!;
  }

  const scored = candidates.map((album) => ({
    album,
    score: scoreAlbumForListener(album, listenerAge),
  }));
  scored.sort(
    (a, b) => b.score - a.score || a.album.title.localeCompare(b.album.title),
  );

  const topScore = scored[0]?.score ?? 0;
  const softTier = scored.filter((entry) => entry.score >= topScore - 12);
  const index = (getDayIndex() + refreshSeed) % softTier.length;
  return softTier[index]?.album ?? scored[0]?.album ?? fallback ?? candidates[0]!;
}

/** Warm microcopy for age-aware surfaces — never algorithm-speak. */
export function getAudienceCurationMicrocopy(listenerAge: number): string {
  if (listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return "For grown-up listening";
  }
  if (listenerAge <= 6) {
    return "Made for little listeners";
  }
  return "Picked for today's listener";
}

export function getAudienceFamilyPicksTitle(listenerAge: number): string {
  const preset = LISTENER_AGE_PRESETS.find((entry) => entry.age === listenerAge);
  if (preset) return `Today's picks for ${preset.label}`;
  return `Picked for age ${listenerAge}`;
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
  const preset = LISTENER_AGE_PRESETS.find((entry) => entry.age === listenerAge);
  const audienceLabel = preset ? preset.label : `age ${listenerAge}`;

  if (listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return `Curated for ${audienceLabel} — grown-up picks up front, full library always available`;
  }
  return `Curated for ${audienceLabel} — cousin songs your age up front, everything still here`;
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
  if (listenerAge >= ADULT_LISTENER_THRESHOLD) {
    return members.filter(
      (member) =>
        isAdultFamilyMember(member) || Math.abs(member.age - listenerAge) <= 8,
    );
  }
  return members.filter((member) => Math.abs(member.age - listenerAge) <= 8);
}
