import { getMemberBySlug, members, type FamilyMember } from "@/data/members";
import { getSongBySlug, getSongsByAuthor, type Song } from "@/data/songs";

export type Album = {
  slug: string;
  title: string;
  subtitle?: string;
  authorSlug: string;
  coverSrc: string;
  songSlugs: string[];
  dateCreated: string;
  story?: string;
  accentColor: string;
};

const CREATOR_ACCENTS: Record<string, string> = {
  marceline: "#ff9ec8",
  eliana: "#ff6fb1",
  solene: "#c4b5fd",
  ocean: "#6cb7ff",
  "tio-chien": "#7dd3fc",
};

const CREATOR_ALBUM_TITLES: Record<string, string> = {
  marceline: "Marceline's Silly Sprint",
  eliana: "Eliana's Pink World",
  solene: "Solene's Painted Garden",
  ocean: "Ocean's Adventures",
  "tio-chien": "Tio Chien's Magic Studio",
};

/** Ongoing / themed albums — add song slugs here as new singles drop. */
const SERIES_ALBUMS: Album[] = [
  {
    slug: "miracle-in-the-sand-album",
    title: "Miracle in the Sand",
    subtitle: "모래 속의 기적 · single out now — more tracks coming",
    authorSlug: "tio-chien",
    coverSrc: "/assets/tio-chien/miracle-in-the-sand.jpg",
    songSlugs: ["miracle-in-the-sand"],
    dateCreated: "2026-06-21",
    story:
      "A growing album series from Tio Chien — intimate indie-pop built for continuity. New songs join this tracklist as they release.",
    accentColor: "#f4c784",
  },
];

const SERIES_ALBUM_SLUGS = new Set(SERIES_ALBUMS.map((album) => album.slug));

function buildCreatorAlbum(member: FamilyMember, memberSongs: Song[]): Album | undefined {
  if (memberSongs.length === 0) return undefined;

  const ordered = [...memberSongs].sort((a, b) => {
    const dateCmp = a.dateCreated.localeCompare(b.dateCreated);
    return dateCmp !== 0 ? dateCmp : a.title.localeCompare(b.title);
  });

  const first = ordered[0];
  if (!first) return undefined;

  return {
    slug: `${member.slug}-album`,
    title: CREATOR_ALBUM_TITLES[member.slug] ?? `Made for ${member.name}`,
    subtitle: `Made for ${member.name} · ${ordered.length} ${ordered.length === 1 ? "song" : "songs"}`,
    authorSlug: member.slug,
    coverSrc: first.coverSrc,
    songSlugs: ordered.map((s) => s.slug),
    dateCreated: first.dateCreated,
    story: member.description,
    accentColor: CREATOR_ACCENTS[member.slug] ?? "#ff6fb1",
  };
}

function buildAlbums(): Album[] {
  const creatorAlbums = members
    .map((member) => buildCreatorAlbum(member, getSongsByAuthor(member.slug)))
    .filter((album): album is Album => album !== undefined);

  return [...SERIES_ALBUMS, ...creatorAlbums];
}

export const albums: Album[] = buildAlbums();

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

export function getAlbumsByAuthor(authorSlug: string): Album[] {
  return albums.filter((album) => album.authorSlug === authorSlug);
}

export function getAlbumSongs(album: Album): Song[] {
  return album.songSlugs
    .map((slug) => getSongBySlug(slug))
    .filter((song): song is Song => song !== undefined);
}

export function getAllAlbums(): Album[] {
  return albums;
}

export function getAlbumForSong(song: Song): Album | undefined {
  const matches = albums.filter((album) => album.songSlugs.includes(song.slug));
  return matches.find((album) => SERIES_ALBUM_SLUGS.has(album.slug)) ?? matches[0];
}

export function getAlbumAuthor(album: Album): FamilyMember | undefined {
  return getMemberBySlug(album.authorSlug);
}

export function getAlbumTrackCount(album: Album): number {
  return album.songSlugs.length;
}
