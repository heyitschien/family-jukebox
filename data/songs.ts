import { getMemberBySlug, type FamilyMember } from "@/data/members";
import { songLyrics } from "@/data/lyrics";

export type Song = {
  slug: string;
  title: string;
  subtitle?: string;
  authorSlug: string;
  dateCreated: string;
  audioSrc: string;
  coverSrc: string;
  videoSrc?: string;
  prompt?: string;
  story?: string;
  lyrics?: string;
  tags: string[];
  featured?: boolean;
};

export const songs: Song[] = [
  {
    slug: "gravity-shift",
    title: "Gravity Shift",
    subtitle: "A family anthem about bending the rules of physics",
    authorSlug: "ocean",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/ocean/gravity-shift.mp3",
    coverSrc: "/assets/ocean/gravity-shift.jpg",
    prompt: "Make a fun song about gravity doing something unexpected.",
    story: "Ocean's adventure anthem from family music day — made together with Gemini.",
    lyrics: songLyrics["gravity-shift"],
    tags: ["adventure", "space", "ocean"],
  },
  {
    slug: "mountains-to-the-shore",
    title: "Mountains to the Shore",
    subtitle: "From peaks to waves — a little journey song",
    authorSlug: "ocean",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/ocean/mountains-to-the-shore.mp3",
    coverSrc: "/assets/ocean/mountains-to-the-shore.jpg",
    story: "Another Ocean original — nature, journey, and cousin-road-trip energy.",
    lyrics: songLyrics["mountains-to-the-shore"],
    tags: ["nature", "journey", "ocean"],
  },
  {
    slug: "dash-and-go",
    title: "Dash and Go",
    subtitle: "Fast feet, big laughs, tiny-human energy",
    authorSlug: "marceline",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/marceline/dash-and-go.mp3",
    coverSrc: "/assets/marceline/dash-and-go.jpg",
    story: "Marceline's silly sprint song — made during a family hangout after games and music together.",
    lyrics: songLyrics["dash-and-go"],
    tags: ["silly", "dance", "energy", "marceline"],
  },
  {
    slug: "pink-glasses-everywhere",
    title: "Pink Glasses Everywhere",
    subtitle: "Seeing the world through rose-colored specs",
    authorSlug: "eliana",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/eliana/pink-glasses-everywhere.mp3",
    coverSrc: "/assets/eliana/pink-glasses-everywhere.jpg",
    lyrics: songLyrics["pink-glasses-everywhere"],
    tags: ["silly", "colorful", "eliana"],
  },
  {
    slug: "foxes-of-the-garden",
    title: "Foxes of the Garden",
    subtitle: "Sneaky foxes and secret garden adventures",
    authorSlug: "solene",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/solene/foxes-of-the-garden.mp3",
    coverSrc: "/assets/solene/foxes-of-the-garden.jpg",
    lyrics: songLyrics["foxes-of-the-garden"],
    tags: ["animals", "garden", "story", "solene"],
  },
  {
    slug: "solene-s-painted-trail",
    title: "Solene's Painted Trail",
    subtitle: "Following colors wherever they lead",
    authorSlug: "solene",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/solene/solenes-painted-trail.mp3",
    coverSrc: "/assets/solene/solene-s-painted-trail.jpg",
    lyrics: songLyrics["solene-s-painted-trail"],
    tags: ["art", "color", "solene"],
  },
  {
    slug: "pixels-into-magic",
    title: "Pixels into Magic",
    subtitle: "When screen time turns into something wonderful",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/tio-chien/pixels-into-magic.mp3",
    coverSrc: "/assets/tio-chien/pixels-into-magic.jpg",
    story: "Tio Chien's tech-meets-magic song from family music day with the cousins.",
    lyrics: songLyrics["pixels-into-magic"],
    tags: ["tech", "magic", "creative", "tio-chien"],
  },
  {
    slug: "crayon-planets",
    title: "Crayon Planets",
    subtitle: "Drawing whole worlds in color, one orbit at a time",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/tio-chien/crayon-planets.mp3",
    coverSrc: "/assets/tio-chien/crayon-planets.jpg",
    story: "Tio Chien's crayon-and-cosmos song — art supplies meet outer space on family music day.",
    lyrics: songLyrics["crayon-planets"],
    tags: ["art", "space", "creative", "tio-chien"],
  },
  {
    slug: "miracle-in-the-sand",
    title: "Miracle in the Sand",
    subtitle: "모래 속의 기적 · the first single from an ongoing album",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/tio-chien/miracle-in-the-sand.mp3",
    coverSrc: "/assets/tio-chien/miracle-in-the-sand.jpg",
    story:
      "The opening single from Tio Chien's growing Miracle in the Sand album — warm indie-pop, intimate vocals, more tracks on the way.",
    lyrics: songLyrics["miracle-in-the-sand"],
    tags: ["single", "indie", "sand", "miracle", "tio-chien"],
    featured: true,
  },
  {
    slug: "gold-in-the-tile",
    title: "Gold in the Tile",
    subtitle: "The first single from Evelyn's growing album",
    authorSlug: "evelyn",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/evelyn/gold-in-the-tile.mp3",
    coverSrc: "/assets/evelyn/gold-in-the-tile.jpg",
    story:
      "The opening single from Evelyn's Gold in the Tile album — warm, golden, and built to grow track by track.",
    lyrics: songLyrics["gold-in-the-tile"],
    tags: ["single", "gold", "evelyn", "featured"],
    featured: true,
  },
  {
    slug: "orange-sweater-sun",
    title: "Orange Sweater Sun",
    subtitle: "K-pop sunshine — Evelyn's second single",
    authorSlug: "evelyn",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/evelyn/orange-sweater-sun.mp3",
    coverSrc: "/assets/evelyn/orange-sweater-sun.jpg",
    story:
      "Evelyn's K-pop styled single — bright hooks, orange-sweater warmth, and the second chapter of her growing album.",
    lyrics: songLyrics["orange-sweater-sun"],
    tags: ["single", "kpop", "pop", "evelyn", "featured"],
    featured: true,
  },
  {
    slug: "silver-pan-morning",
    title: "Silver Pan Morning",
    subtitle: "Sunday pancakes and coffee steam — Evelyn's latest",
    authorSlug: "evelyn",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/evelyn/silver-pan-morning.mp3",
    coverSrc: "/assets/evelyn/silver-pan-morning.jpg",
    story:
      "A Sunday-morning love song — silver pan, chocolate chips, and the quiet magic of cooking up the future together.",
    lyrics: songLyrics["silver-pan-morning"],
    tags: ["single", "indie", "pop", "evelyn", "featured"],
    featured: true,
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function getSongsByAuthor(authorSlug: string): Song[] {
  return songs.filter((song) => song.authorSlug === authorSlug);
}

function buildSongTagSet(seedSongs: Song[]): Set<string> {
  const tags = new Set<string>();
  for (const seed of seedSongs) {
    for (const tag of seed.tags) {
      tags.add(tag.toLowerCase());
    }
  }
  return tags;
}

function countSharedTags(tagSet: Set<string>, candidate: Song): number {
  return candidate.tags.reduce((count, tag) => {
    return tagSet.has(tag.toLowerCase()) ? count + 1 : count;
  }, 0);
}

type SimilarSongOptions = {
  limit?: number;
  excludeAuthorSlug?: string;
  excludeSongSlugs?: Iterable<string>;
};

export function getSongsSimilarToCollection(
  seedSongs: Song[],
  { limit = 6, excludeAuthorSlug, excludeSongSlugs }: SimilarSongOptions = {},
): Song[] {
  if (seedSongs.length === 0) return [];
  const tagSet = buildSongTagSet(seedSongs);
  const blockedSlugs = new Set<string>(excludeSongSlugs ?? []);

  return songs
    .filter((candidate) => {
      if (blockedSlugs.has(candidate.slug)) return false;
      if (excludeAuthorSlug && candidate.authorSlug === excludeAuthorSlug) return false;
      return true;
    })
    .map((candidate) => ({
      song: candidate,
      sharedTagCount: countSharedTags(tagSet, candidate),
    }))
    .filter((entry) => entry.sharedTagCount > 0)
    .sort((a, b) => {
      if (b.sharedTagCount !== a.sharedTagCount) return b.sharedTagCount - a.sharedTagCount;
      if (b.song.featured !== a.song.featured) return Number(b.song.featured) - Number(a.song.featured);
      const dateCmp = b.song.dateCreated.localeCompare(a.song.dateCreated);
      if (dateCmp !== 0) return dateCmp;
      return a.song.title.localeCompare(b.song.title);
    })
    .slice(0, limit)
    .map((entry) => entry.song);
}

export function getSimilarSongs(song: Song, options: SimilarSongOptions = {}): Song[] {
  return getSongsSimilarToCollection([song], {
    ...options,
    excludeSongSlugs: [song.slug, ...(options.excludeSongSlugs ?? [])],
  });
}

export function getSongAuthor(song: Song): FamilyMember | undefined {
  return getMemberBySlug(song.authorSlug);
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const song of songs) {
    for (const tag of song.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
