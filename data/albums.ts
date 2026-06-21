import { getMemberBySlug, type FamilyMember } from "@/data/members";
import { getSongBySlug, type Song } from "@/data/songs";
import { getDayIndex } from "@/lib/featured-rotation";

export type AlbumPalette = {
  accent: string;
  glow: string;
  surface: string;
  surfaceAlt: string;
};

export type AlbumKind = "album" | "ep";

export type Album = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  memberSlug: string;
  releaseDate: string;
  coverSrc: string;
  kind: AlbumKind;
  songSlugs: string[];
  palette: AlbumPalette;
};

export const albums: Album[] = [
  {
    slug: "marceline-dash-and-go",
    title: "Dash & Go",
    subtitle: "Tiny-sprinter energy with a one-song victory lap.",
    description:
      "A playful starter album for Marceline built from the song we already made for her. It is framed like a collectible release now, with room to grow as more tracks arrive.",
    memberSlug: "marceline",
    releaseDate: "2026-06-19",
    coverSrc: "/assets/marceline/dash-and-go.jpg",
    kind: "ep",
    songSlugs: ["dash-and-go"],
    palette: {
      accent: "#ff88c8",
      glow: "rgba(255, 136, 200, 0.35)",
      surface: "rgba(58, 18, 44, 0.94)",
      surfaceAlt: "rgba(150, 40, 96, 0.55)",
    },
  },
  {
    slug: "eliana-pink-glasses-club",
    title: "Pink Glasses Club",
    subtitle: "A bright little world where everything gets softer and more colorful.",
    description:
      "Eliana's first album turns her existing song into a polished feature release with a strong visual identity, playful copy, and direct play-from-home behavior.",
    memberSlug: "eliana",
    releaseDate: "2026-06-19",
    coverSrc: "/assets/eliana/pink-glasses-everywhere.jpg",
    kind: "ep",
    songSlugs: ["pink-glasses-everywhere"],
    palette: {
      accent: "#ffb3ea",
      glow: "rgba(255, 179, 234, 0.38)",
      surface: "rgba(61, 18, 63, 0.94)",
      surfaceAlt: "rgba(201, 84, 184, 0.5)",
    },
  },
  {
    slug: "solene-foxes-and-painted-trails",
    title: "Foxes & Painted Trails",
    subtitle: "Storybook colors, secret gardens, and handmade adventures.",
    description:
      "Solene already had enough material for a proper multi-track collection, so her songs are now bundled into one album page with sequential playback and track context.",
    memberSlug: "solene",
    releaseDate: "2026-06-19",
    coverSrc: "/assets/solene/foxes-of-the-garden.jpg",
    kind: "album",
    songSlugs: ["foxes-of-the-garden", "solene-s-painted-trail"],
    palette: {
      accent: "#ffb36b",
      glow: "rgba(255, 179, 107, 0.35)",
      surface: "rgba(45, 27, 10, 0.94)",
      surfaceAlt: "rgba(129, 85, 24, 0.56)",
    },
  },
  {
    slug: "ocean-gravity-shift",
    title: "Gravity Shift",
    subtitle: "Adventure songs that jump from mountains to the edge of space.",
    description:
      "Ocean's catalog now reads like a real release: cinematic cover art, an album hero moment, and the existing tracks lined up for album-first listening.",
    memberSlug: "ocean",
    releaseDate: "2026-06-19",
    coverSrc: "/assets/ocean/gravity-shift.jpg",
    kind: "album",
    songSlugs: ["gravity-shift", "mountains-to-the-shore"],
    palette: {
      accent: "#79c8ff",
      glow: "rgba(121, 200, 255, 0.34)",
      surface: "rgba(10, 28, 45, 0.95)",
      surfaceAlt: "rgba(32, 84, 131, 0.52)",
    },
  },
  {
    slug: "tio-chien-pixels-into-magic",
    title: "Pixels into Magic",
    subtitle: "Creative experiments where prompts, crayons, and cosmos all fit together.",
    description:
      "Tio Chien's existing songs become a polished feature album that can anchor landing-page storytelling while still behaving like a playable collection.",
    memberSlug: "tio-chien",
    releaseDate: "2026-06-19",
    coverSrc: "/assets/tio-chien/pixels-into-magic.jpg",
    kind: "album",
    songSlugs: ["pixels-into-magic", "crayon-planets"],
    palette: {
      accent: "#7ef0d6",
      glow: "rgba(126, 240, 214, 0.34)",
      surface: "rgba(13, 34, 37, 0.95)",
      surfaceAlt: "rgba(42, 115, 108, 0.52)",
    },
  },
];

function rotateArray<T>(items: T[], offset: number): T[] {
  if (items.length === 0) return [];
  const normalized = ((offset % items.length) + items.length) % items.length;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}

export function getAlbumCreator(album: Album): FamilyMember | undefined {
  return getMemberBySlug(album.memberSlug);
}

export function getAlbumSongs(albumOrSlug: Album | string): Song[] {
  const album = typeof albumOrSlug === "string" ? getAlbumBySlug(albumOrSlug) : albumOrSlug;
  if (!album) return [];

  return album.songSlugs
    .map((songSlug) => getSongBySlug(songSlug))
    .filter((song): song is Song => song !== undefined);
}

export function getAlbumForSong(songSlug: string): Album | undefined {
  return albums.find((album) => album.songSlugs.includes(songSlug));
}

export function getAlbumTrackNumber(songSlug: string): number | undefined {
  const album = getAlbumForSong(songSlug);
  if (!album) return undefined;
  const index = album.songSlugs.indexOf(songSlug);
  return index >= 0 ? index + 1 : undefined;
}

export function getAlbumTags(album: Album): string[] {
  const tagSet = new Set<string>();
  for (const song of getAlbumSongs(album)) {
    for (const tag of song.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet];
}

export function getAlbumsByMember(memberSlug: string): Album[] {
  return albums.filter((album) => album.memberSlug === memberSlug);
}

export function getFeaturedAlbum(refreshSeed = 0): Album | undefined {
  return getRotatedAlbums(refreshSeed)[0];
}

export function getRotatedAlbums(refreshSeed = 0): Album[] {
  return rotateArray(albums, getDayIndex() + refreshSeed);
}
