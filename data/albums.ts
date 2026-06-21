import { members, type FamilyMember, type MemberRole } from "@/data/members";
import { getSongsByAuthor, songs, type Song } from "@/data/songs";

export type Album = {
  slug: string;
  title: string;
  subtitle: string;
  artistSlug: string;
  coverSrc: string;
  releaseDate: string;
  songSlugs: string[];
  accentFrom: string;
  accentTo: string;
};

export type AlbumBundle = {
  album: Album;
  artist: FamilyMember;
  songs: Song[];
};

const memberPalette: Record<string, { from: string; to: string }> = {
  marceline: { from: "#ff8ebf", to: "#9f7aea" },
  eliana: { from: "#f472b6", to: "#fb7185" },
  solene: { from: "#a78bfa", to: "#60a5fa" },
  ocean: { from: "#38bdf8", to: "#22d3ee" },
  "tio-chien": { from: "#f59e0b", to: "#ec4899" },
};

function getAlbumLineByRole(role: MemberRole): string {
  switch (role) {
    case "girl":
      return "Kid-crafted songs turned into one replayable collection.";
    case "boy":
      return "Adventure-heavy tracks gathered into one album drop.";
    case "tio":
      return "Creative studio cuts and family collab energy.";
    default: {
      const _exhaustive: never = role;
      return _exhaustive;
    }
  }
}

function createAlbumForMember(member: FamilyMember): Album | null {
  const memberSongs = getSongsByAuthor(member.slug);
  if (memberSongs.length === 0) return null;

  const sortedSongs = [...memberSongs].sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));
  const latest = sortedSongs[sortedSongs.length - 1] ?? sortedSongs[0];
  const cover = latest?.coverSrc ?? sortedSongs[0]?.coverSrc;
  const palette = memberPalette[member.slug] ?? { from: "#7dd3fc", to: "#f472b6" };

  return {
    slug: `${member.slug}-album`,
    title: `${member.name} Album`,
    subtitle: getAlbumLineByRole(member.role),
    artistSlug: member.slug,
    coverSrc: cover ?? "",
    releaseDate: latest?.dateCreated ?? "2026-06-19",
    songSlugs: sortedSongs.map((song) => song.slug),
    accentFrom: palette.from,
    accentTo: palette.to,
  };
}

export const albums: Album[] = members
  .map((member) => createAlbumForMember(member))
  .filter((album): album is Album => album !== null)
  .sort((a, b) => {
    if (a.releaseDate === b.releaseDate) {
      return b.songSlugs.length - a.songSlugs.length;
    }
    return b.releaseDate.localeCompare(a.releaseDate);
  });

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

export function getAlbumsByArtistSlug(artistSlug: string): Album[] {
  return albums.filter((album) => album.artistSlug === artistSlug);
}

export function getAlbumSongs(album: Album): Song[] {
  const wanted = new Set(album.songSlugs);
  return songs.filter((song) => wanted.has(song.slug));
}

export function getAlbumForSong(songSlug: string): Album | undefined {
  return albums.find((album) => album.songSlugs.includes(songSlug));
}

export function getAlbumBundles(): AlbumBundle[] {
  return albums
    .map((album) => {
      const artist = members.find((member) => member.slug === album.artistSlug);
      if (!artist) return null;
      return {
        album,
        artist,
        songs: getAlbumSongs(album),
      };
    })
    .filter((bundle): bundle is AlbumBundle => bundle !== null);
}

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return items;
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

export function getRotatedAlbumBundles(seed = 0): AlbumBundle[] {
  return rotateArray(getAlbumBundles(), seed);
}
