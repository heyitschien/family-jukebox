export type Song = {
  slug: string;
  title: string;
  subtitle?: string;
  people: string[];
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
    people: ["Family"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/gravity-shift.mp3",
    coverSrc: "/assets/covers/gravity-shift.jpg",
    prompt: "Make a fun song about gravity doing something unexpected.",
    story: "One of our first family music day creations — made together with Gemini.",
    tags: ["family", "adventure", "space"],
    featured: true,
  },
  {
    slug: "dash-and-go",
    title: "Dash and Go",
    subtitle: "Fast feet, big laughs, cousin energy",
    people: ["Cousins", "Kids"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/dash-and-go.mp3",
    coverSrc: "/assets/covers/dash-and-go.jpg",
    story: "Made during a family hangout after games and music together.",
    tags: ["silly", "cousins", "dance", "energy"],
  },
  {
    slug: "foxes-of-the-garden",
    title: "Foxes of the Garden",
    subtitle: "Sneaky foxes and secret garden adventures",
    people: ["Family", "Kids"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/foxes-of-the-garden.mp3",
    coverSrc: "/assets/covers/foxes-of-the-garden.jpg",
    tags: ["animals", "garden", "story", "kids"],
  },
  {
    slug: "mountains-to-the-shore",
    title: "Mountains to the Shore",
    subtitle: "From peaks to waves — a little family journey song",
    people: ["Family"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/mountains-to-the-shore.mp3",
    coverSrc: "/assets/covers/mountains-to-the-shore.jpg",
    tags: ["nature", "journey", "family"],
  },
  {
    slug: "pink-glasses-everywhere",
    title: "Pink Glasses Everywhere",
    subtitle: "Seeing the world through rose-colored specs",
    people: ["Family", "Kids"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/pink-glasses-everywhere.mp3",
    coverSrc: "/assets/covers/pink-glasses-everywhere.jpg",
    tags: ["silly", "colorful", "kids"],
  },
  {
    slug: "pixels-into-magic",
    title: "Pixels into Magic",
    subtitle: "When screen time turns into something wonderful",
    people: ["Family", "Kids"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/pixels-into-magic.mp3",
    coverSrc: "/assets/covers/pixels-into-magic.jpg",
    tags: ["tech", "magic", "creative"],
  },
  {
    slug: "solane-s-painted-trail",
    title: "Solane's Painted Trail",
    subtitle: "Following colors wherever they lead",
    people: ["Solane", "Family"],
    dateCreated: "2026-06-19",
    audioSrc: "/assets/songs/solane-s-painted-trail.mp3",
    coverSrc: "/assets/covers/solane-s-painted-trail.jpg",
    tags: ["art", "color", "family"],
  },
];

export function getSongBySlug(slug: string): Song | undefined {
  return songs.find((song) => song.slug === slug);
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
