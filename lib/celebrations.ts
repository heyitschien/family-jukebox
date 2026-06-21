import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";

export type CelebrationHighlight = {
  id: string;
  label: string;
  emoji: string;
  badgePrefix: string;
  songSlugs: string[];
  albumSlugs: string[];
  matchesDate: (date: Date) => boolean;
};

/** Third Sunday of June — US Father's Day. */
export function getFathersDayDate(year: number): { month: number; day: number } {
  const june1 = new Date(year, 5, 1);
  const daysUntilSunday = (7 - june1.getDay()) % 7;
  const thirdSunday = 1 + daysUntilSunday + 14;
  return { month: 6, day: thirdSunday };
}

export const celebrationHighlights: CelebrationHighlight[] = [
  {
    id: "marceline-birthday",
    label: "Marceline's birthday",
    emoji: "🎂",
    badgePrefix: "Happy 3rd birthday · ",
    songSlugs: ["three-candles-for-marceline"],
    albumSlugs: ["three-candles-for-marceline-album"],
    matchesDate: (date) => date.getMonth() === 5 && date.getDate() === 21,
  },
  {
    id: "fathers-day",
    label: "Father's Day",
    emoji: "👔",
    badgePrefix: "Happy Father's Day · ",
    songSlugs: ["legacy-in-the-lane"],
    albumSlugs: ["legacy-in-the-lane-album"],
    matchesDate: (date) => {
      const fathersDay = getFathersDayDate(date.getFullYear());
      return date.getMonth() + 1 === fathersDay.month && date.getDate() === fathersDay.day;
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
