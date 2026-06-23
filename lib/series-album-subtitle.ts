import { getSongBySlug } from "@/data/songs";

/** Build a growing-series subtitle from track slugs — e.g. "Song A · Song B · more coming". */
export function buildSeriesAlbumSubtitle(
  songSlugs: string[],
  titleBySlug: Record<string, string> = {},
  moreComing = true,
): string {
  const titles = songSlugs
    .map((slug) => titleBySlug[slug] ?? getSongBySlug(slug)?.title)
    .filter((title): title is string => Boolean(title));

  if (titles.length === 0) return "More tracks coming";
  const joined = titles.join(" · ");
  return moreComing ? `${joined} · more coming` : joined;
}
