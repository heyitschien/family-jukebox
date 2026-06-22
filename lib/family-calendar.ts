/** Family jukebox dates use one stable timezone so SSR and browsers agree. */
export const FAMILY_TIME_ZONE = "America/Chicago";

export function getFamilyCalendarParts(date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: FAMILY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
  };
}

export function getFamilyDayIndex(date = new Date()): number {
  const { year, month, day } = getFamilyCalendarParts(date);
  const utcMidnight = Date.UTC(year, month - 1, day);
  const yearStart = Date.UTC(year, 0, 0);
  return Math.floor((utcMidnight - yearStart) / 86_400_000);
}

export function isWithinFamilyCelebrationWindow(
  month: number,
  day: number,
  windowDays = 3,
  date = new Date(),
): boolean {
  const { year, month: currentMonth, day: currentDay } = getFamilyCalendarParts(date);
  const target = Date.UTC(year, currentMonth - 1, currentDay);
  const center = Date.UTC(year, month - 1, day);
  const windowMs = windowDays * 86_400_000;
  return Math.abs(target - center) <= windowMs;
}
