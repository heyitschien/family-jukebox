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
    subtitle: "모래 속의 기적 · track one · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/tio-chien/miracle-in-the-sand.mp3",
    coverSrc: "/assets/tio-chien/miracle-in-the-sand.jpg",
    story:
      "The opening single from Tio Chien's Printing Intelligence on Sand series — warm indie-pop, intimate vocals, more tracks on the way.",
    lyrics: songLyrics["miracle-in-the-sand"],
    tags: ["single", "indie", "sand", "miracle", "tio-chien", "series"],
    featured: true,
  },
  {
    slug: "tap-on-the-glass",
    title: "Tap on the Glass",
    subtitle: "Track two · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-22",
    audioSrc: "/assets/tio-chien/tap-on-the-glass.mp3",
    coverSrc: "/assets/tio-chien/tap-on-the-glass.jpg",
    story:
      "The second single from Printing Intelligence on Sand — miracles feel normal now, intelligence blooms in every hour, tap on the glass and the work begins.",
    lyrics: songLyrics["tap-on-the-glass"],
    tags: ["single", "indie", "tech", "sand", "tio-chien", "series", "featured"],
    featured: true,
  },
  {
    slug: "morning-sun-neon-light",
    title: "Morning Sun Neon Light",
    subtitle: "심장을 잊지 마 · track three · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-22",
    audioSrc: "/assets/tio-chien/morning-sun-neon-light.mp3",
    coverSrc: "/assets/tio-chien/morning-sun-neon-light.jpg",
    story:
      "The third single from Printing Intelligence on Sand — morning sun, neon light, and a reminder not to forget the heart while the silicon keeps printing.",
    lyrics: songLyrics["morning-sun-neon-light"],
    tags: ["single", "indie", "korean", "sand", "tio-chien", "series", "featured"],
    featured: true,
  },
  {
    slug: "gold-in-the-tile",
    title: "Gold in the Tile",
    subtitle: "The first single from Tia Evelyn's growing album",
    authorSlug: "evelyn",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/evelyn/gold-in-the-tile.mp3",
    coverSrc: "/assets/evelyn/gold-in-the-tile.jpg",
    story:
      "The opening single from Tia Evelyn's Gold in the Tile album — warm, golden, and built to grow track by track.",
    lyrics: songLyrics["gold-in-the-tile"],
    tags: ["single", "gold", "evelyn", "featured"],
    featured: true,
  },
  {
    slug: "orange-sweater-sun",
    title: "Orange Sweater Sun",
    subtitle: "K-pop sunshine — Tia Evelyn's second single",
    authorSlug: "evelyn",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/evelyn/orange-sweater-sun.mp3",
    coverSrc: "/assets/evelyn/orange-sweater-sun.jpg",
    story:
      "Tia Evelyn's K-pop styled single — bright hooks, orange-sweater warmth, and the second chapter of her growing album.",
    lyrics: songLyrics["orange-sweater-sun"],
    tags: ["single", "kpop", "pop", "evelyn", "featured"],
    featured: true,
  },
  {
    slug: "silver-pan-morning",
    title: "Silver Pan Morning",
    subtitle: "Sunday pancakes and coffee steam — Tia Evelyn's latest",
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
  {
    slug: "three-candles-for-marceline",
    title: "Three Candles for Marceline",
    subtitle: "Happy 3rd birthday · June 21",
    authorSlug: "marceline",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/marceline/three-candles-for-marceline.mp3",
    coverSrc: "/assets/marceline/three-candles-for-marceline.jpg",
    story:
      "Marceline turns three today — candles, sunshine, and a birthday song for the littlest cousin with Ico by her side.",
    lyrics: songLyrics["three-candles-for-marceline"],
    tags: ["birthday", "celebration", "marceline", "featured"],
    featured: true,
  },
  {
    slug: "legacy-in-the-lane",
    title: "Legacy in the Lane",
    subtitle: "A Father's Day single · coaching, love, and real superheroes",
    authorSlug: "sam-and-josh",
    dateCreated: "2026-06-21",
    audioSrc: "/assets/sam-and-josh/legacy-in-the-lane.mp3",
    coverSrc: "/assets/sam-and-josh/legacy-in-the-lane.png",
    story:
      "Tio Sam & Tio Josh's Father's Day release — a hip-hop love letter to dads on the court, in the lane, and at home.",
    lyrics: songLyrics["legacy-in-the-lane"],
    tags: ["fathers-day", "single", "hip-hop", "celebration", "sam-and-josh", "featured"],
    featured: true,
  },
  {
    slug: "the-city-breathing",
    title: "The City Breathing",
    subtitle: "Track four · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-23",
    audioSrc: "/assets/tio-chien/the-city-breathing.mp3",
    coverSrc: "/assets/tio-chien/the-city-breathing.jpg",
    story:
      "The fourth single from Printing Intelligence on Sand — the city wakes, circuits hum, and the sand keeps printing intelligence into the night.",
    lyrics: songLyrics["the-city-breathing"],
    tags: ["single", "indie", "tio-chien", "series", "featured"],
    featured: true,
  },
  {
    slug: "the-future-in-my-palm",
    title: "The Future in My Palm",
    subtitle: "Track five · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-23",
    audioSrc: "/assets/tio-chien/the-future-in-my-palm.mp3",
    coverSrc: "/assets/tio-chien/the-future-in-my-palm.jpg",
    story:
      "The fifth single from Printing Intelligence on Sand — sand becomes signal, and the future speaks back in your hand.",
    lyrics: songLyrics["the-future-in-my-palm"],
    tags: ["single", "indie", "kpop", "tio-chien", "series", "featured"],
    featured: true,
  },
  {
    slug: "cornerstone-at-the-kitchen-table",
    title: "Cornerstone at the Kitchen Table",
    subtitle: "The first single from Mama's growing album",
    authorSlug: "maria",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/maria/cornerstone-at-the-kitchen-table.mp3",
    coverSrc: "/assets/maria/cornerstone-at-the-kitchen-table.jpg",
    story:
      "Mama's opening single — warmth at the kitchen table, love in every meal, and the feeling of home that holds a family together.",
    lyrics: songLyrics["cornerstone-at-the-kitchen-table"],
    tags: ["single", "indie", "family", "maria", "featured"],
    featured: true,
  },
  {
    slug: "teachers-on-the-wall",
    title: "Teachers on the Wall",
    subtitle: "Track one · Egg Rolls & Epiphanies",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/tio-chien/teachers-on-the-wall.mp3",
    coverSrc: "/assets/tio-chien/teachers-on-the-wall.jpg",
    story:
      "The opening single from Egg Rolls & Epiphanies — celebrating friendship, featuring Paul Savage.",
    lyrics: songLyrics["teachers-on-the-wall"],
    tags: ["single", "indie", "tio-chien", "series", "featured", "friendship"],
    featured: true,
  },
  {
    slug: "slow-turning-pages",
    title: "Slow Turning Pages",
    subtitle: "Track one · Study Lo-Fi",
    authorSlug: "chilling-with-cousin",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/chilling-with-cousin/slow-turning-pages.mp3",
    coverSrc: "/assets/chilling-with-cousin/slow-turning-pages.jpg",
    story:
      "Instrumental study lo-fi — calm background music for focus, reading, and sharing.",
    lyrics: songLyrics["slow-turning-pages"],
    tags: ["lofi", "chill", "study", "instrumental", "background", "chilling-with-cousin"],
  },
  {
    slug: "the-margin-notes",
    title: "The Margin Notes",
    subtitle: "Track two · Study Lo-Fi",
    authorSlug: "chilling-with-cousin",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/chilling-with-cousin/the-margin-notes.mp3",
    coverSrc: "/assets/chilling-with-cousin/the-margin-notes.jpg",
    story:
      "Instrumental study lo-fi — quiet beats for focus, notes in the margin, and background listening.",
    lyrics: songLyrics["the-margin-notes"],
    tags: ["lofi", "chill", "study", "instrumental", "background", "chilling-with-cousin"],
  },
  {
    slug: "rain-on-the-glass",
    title: "Rain on the Glass",
    subtitle: "Track three · Study Lo-Fi",
    authorSlug: "chilling-with-cousin",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/chilling-with-cousin/rain-on-the-glass.mp3",
    coverSrc: "/assets/chilling-with-cousin/rain-on-the-glass.jpg",
    story:
      "Instrumental study lo-fi — rain on the window, calm focus, background listening.",
    lyrics: songLyrics["rain-on-the-glass"],
    tags: ["lofi", "chill", "study", "instrumental", "background", "chilling-with-cousin"],
  },
  {
    slug: "where-the-garden-sleeps",
    title: "Where the Garden Sleeps",
    subtitle: "Track four · Study Lo-Fi",
    authorSlug: "chilling-with-cousin",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/chilling-with-cousin/where-the-garden-sleeps.mp3",
    coverSrc: "/assets/chilling-with-cousin/where-the-garden-sleeps.jpg",
    story:
      "Instrumental study lo-fi — quiet garden dusk, soft beats for focus and background listening.",
    lyrics: songLyrics["where-the-garden-sleeps"],
    tags: ["lofi", "chill", "study", "instrumental", "background", "chilling-with-cousin"],
  },
  {
    slug: "steady-light-in-your-eye",
    title: "Steady Light in Your Eye",
    subtitle: "Track two · Egg Rolls & Epiphanies",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-24",
    audioSrc: "/assets/tio-chien/steady-light-in-your-eye.mp3",
    coverSrc: "/assets/tio-chien/steady-light-in-your-eye.jpg",
    story:
      "The second single from Egg Rolls & Epiphanies — celebrating friendship, featuring Paul Savage.",
    lyrics: songLyrics["steady-light-in-your-eye"],
    tags: ["single", "indie", "tio-chien", "series", "featured", "friendship"],
    featured: true,
  },
  {
    slug: "the-porch-light-glow",
    title: "The Porch Light Glow",
    subtitle: "Track three · Egg Rolls & Epiphanies",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-25",
    audioSrc: "/assets/tio-chien/the-porch-light-glow.mp3",
    coverSrc: "/assets/tio-chien/the-porch-light-glow.jpg",
    story:
      "The third single from Egg Rolls & Epiphanies — celebrating friendship, featuring Paul Savage.",
    lyrics: songLyrics["the-porch-light-glow"],
    tags: ["single", "indie", "tio-chien", "series", "featured", "friendship"],
    featured: true,
  },
  {
    slug: "the-room-changes-the-mind",
    title: "The Room Changes the Mind",
    subtitle: "빛을 선택해 · track six · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-25",
    audioSrc: "/assets/tio-chien/the-room-changes-the-mind.mp3",
    coverSrc: "/assets/tio-chien/the-room-changes-the-mind.jpg",
    story:
      "The sixth single from Printing Intelligence on Sand — rooms, screens, and light shape how we think; choose the place that brings you back.",
    lyrics: songLyrics["the-room-changes-the-mind"],
    tags: ["single", "indie", "kpop", "tio-chien", "series", "featured"],
    featured: true,
  },
  {
    slug: "ask-again",
    title: "Ask Again",
    subtitle: "유리 위 선명한 답 · track seven · Printing Intelligence on Sand",
    authorSlug: "tio-chien",
    dateCreated: "2026-06-25",
    audioSrc: "/assets/tio-chien/ask-again.mp3",
    coverSrc: "/assets/tio-chien/ask-again.jpg",
    story:
      "The seventh single from Printing Intelligence on Sand — messy thoughts, answers on glass, and the magic of asking again until your own mind becomes clear.",
    lyrics: songLyrics["ask-again"],
    tags: ["single", "indie", "kpop", "tio-chien", "series", "featured"],
    featured: true,
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
