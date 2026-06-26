import type { Album } from "@/data/albums";
import type { FamilyMember } from "@/data/members";

export const HERO_WANDER_COPY =
  "Press play and wander through the family: birthday songs, fox trails, bedtime memories, garden beats, and little anthems made just because someone is loved.";

/** Main emotional stats line — names belong in screen-reader detail, not here. */
export function getHeroStatsLine(albumCount: number): string {
  return `${albumCount} family album${albumCount === 1 ? "" : "s"} and growing · everyone gets a turn at the table`;
}

/** Love-first album blurb for the hero — prefers album story when available. */
export function getHeroAlbumDescription(album: Album, author?: FamilyMember): string {
  if (album.story?.trim()) return album.story.trim();

  const who = author?.name ?? "the family";
  return `Little anthems from ${who} — songs made with love for cousins, aunties, uncles, and grandparents around the table.`;
}
