import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import {
  getFamilyCalendarParts,
  isWithinFamilyCelebrationWindow,
} from "@/lib/family-calendar";

export type CelebrationHighlight = {
  id: string;
  label: string;
  emoji: string;
  badgePrefix: string;
  songSlugs: string[];
  albumSlugs: string[];
  matchesDate: (date: Date) => boolean;
};

/** Third Sunday of June — US Father's Day (family calendar). */
export function getFathersDayDate(year: number): { month: number; day: number } {
  const june1 = new Date(Date.UTC(year, 5, 1));
  const daysUntilSunday = (7 - june1.getUTCDay()) % 7;
  const thirdSunday = 1 + daysUntilSunday + 14;
  return { month: 6, day: thirdSunday };
}

/** Stable celebration window using the family timezone. */
export function isWithinCelebrationWindow(
  date: Date,
  month: number,
  day: number,
  windowDays = 3,
): boolean {
  return isWithinFamilyCelebrationWindow(month, day, windowDays, date);
}

export const celebrationHighlights: CelebrationHighlight[] = [
  {
    id: "rachel-birthday",
    label: "Tia Rachel's birthday",
    emoji: "☀️",
    badgePrefix: "Happy birthday · ",
    songSlugs: ["smallest-of-deeds"],
    albumSlugs: ["smallest-of-deeds-album"],
    matchesDate: (date) => isWithinCelebrationWindow(date, 6, 19),
  },
  {
    id: "marceline-birthday",
    label: "Marceline's birthday",
    emoji: "🎂",
    badgePrefix: "Happy 3rd birthday · ",
    songSlugs: ["three-candles-for-marceline"],
    albumSlugs: ["three-candles-for-marceline-album"],
    matchesDate: (date) => isWithinCelebrationWindow(date, 6, 21),
  },
  {
    id: "fathers-day",
    label: "Father's Day",
    emoji: "👔",
    badgePrefix: "Happy Father's Day · ",
    songSlugs: ["legacy-in-the-lane"],
    albumSlugs: ["legacy-in-the-lane-album"],
    matchesDate: (date) => {
      const fathersDay = getFathersDayDate(getFamilyCalendarParts(date).year);
      return isWithinCelebrationWindow(date, fathersDay.month, fathersDay.day);
    },
  },
];

export function getActiveCelebrations(date = new Date()): CelebrationHighlight[] {
  return celebrationHighlights.filter((highlight) => highlight.matchesDate(date));
}

export function getCelebrationSongSlugs(date = new Date()): string[] {
  return getActiveCelebrations(date).flatMap((highlight) => highlight.songSlugs);
}

export function getCelebrationAlbumSlugs(date = new Date()): string[] {
  return getActiveCelebrations(date).flatMap((highlight) => highlight.albumSlugs);
}

export function isCelebrationSong(song: Song, date = new Date()): boolean {
  return getCelebrationSongSlugs(date).includes(song.slug);
}

export function isCelebrationAlbum(album: Album, date = new Date()): boolean {
  return getCelebrationAlbumSlugs(date).includes(album.slug);
}

export function getCelebrationHeroBadge(
  album: Album,
  date = new Date(),
): { emoji: string; prefix: string } | undefined {
  const highlight = getActiveCelebrations(date).find((item) => item.albumSlugs.includes(album.slug));
  if (!highlight) return undefined;
  return { emoji: highlight.emoji, prefix: highlight.badgePrefix };
}

export function getCelebrationLabels(date = new Date()): string {
  return getActiveCelebrations(date)
    .map((item) => item.label)
    .join(" · ");
}
