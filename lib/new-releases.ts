import type { Song } from "@/data/songs";
import { getFamilyCalendarParts } from "@/lib/family-calendar";

/** Songs show a new-release badge for this many calendar days after dateCreated (day 0–2). */
export const NEW_RELEASE_WINDOW_DAYS = 3;

function parseReleaseDate(dateCreated: string): { year: number; month: number; day: number } {
  const [year, month, day] = dateCreated.split("-").map(Number);
  return { year, month, day };
}

function toFamilyDayUtc(parts: { year: number; month: number; day: number }): number {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

export function getDaysSinceRelease(song: Song, date = new Date()): number {
  const release = parseReleaseDate(song.dateCreated);
  const today = getFamilyCalendarParts(date);
  return Math.floor((toFamilyDayUtc(today) - toFamilyDayUtc(release)) / 86_400_000);
}

export function isNewRelease(
  song: Song,
  date = new Date(),
  windowDays = NEW_RELEASE_WINDOW_DAYS,
): boolean {
  const days = getDaysSinceRelease(song, date);
  return days >= 0 && days < windowDays;
}

export function getNewReleaseLabel(song: Song, date = new Date()): string | undefined {
  if (!isNewRelease(song, date)) return undefined;
  const days = getDaysSinceRelease(song, date);
  if (days === 0) return "New today";
  if (days === 1) return "New yesterday";
  return "New release";
}
