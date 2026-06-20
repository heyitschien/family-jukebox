import { getMemberBySlug, type FamilyMember } from "@/data/members";

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
    tags: ["animals", "garden", "story", "solene"],
  },
  {
    slug: "solene-s-painted-trail",
    title: "Solene's Painted Trail",
    subtitle: "Following colors wherever they lead",
    authorSlug: "solene",
    dateCreated: "2026-06-19",
    audioSrc: "/assets/solene/solenes-painted-trail.mp3",
    coverSrc: "/assets/solene/solenes-painted-trail.jpg",
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
    tags: ["tech", "magic", "creative", "tio-chien"],
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
}

export function getSongsByAuthor(authorSlug: string): Song[] {
  return songs.filter((song) => song.authorSlug === authorSlug);
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
