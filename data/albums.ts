import { getMemberBySlug, members, type FamilyMember } from "@/data/members";
import { getSongBySlug, getSongsByAuthor, songs, type Song } from "@/data/songs";

export type AlbumKind = "series" | "discography";

export type Album = {
  slug: string;
  kind: AlbumKind;
  title: string;
  subtitle?: string;
  authorSlug: string;
  coverSrc: string;
  songSlugs: string[];
  dateCreated: string;
  story?: string;
  accentColor: string;
  /** Pinned to hero + front of landing carousel */
  featured?: boolean;
};

const CREATOR_ACCENTS: Record<string, string> = {
  kaia: "#ffb7c5",
  marceline: "#ff9ec8",
  eliana: "#ff6fb1",
  solene: "#c4b5fd",
  ocean: "#6cb7ff",
  "tio-chien": "#7dd3fc",
  evelyn: "#d4af37",
  rachel: "#f4a261",
  maria: "#c9956b",
  "sam-and-josh": "#f59e0b",
  "chilling-with-cousin": "#8b9dc3",
};

const CREATOR_ALBUM_TITLES: Record<string, string> = {
  kaia: "Kaia's Little Heart",
  marceline: "Marceline's Silly Sprint",
  eliana: "Eliana's Pink World",
  solene: "Solene's Painted Garden",
  ocean: "Ocean's Adventures",
  "tio-chien": "Tio Chien's Magic Studio",
  evelyn: "Tia Evelyn",
  rachel: "Tia Rachel",
  maria: "Mama",
  "sam-and-josh": "Tio Sam & Tio Josh",
  "chilling-with-cousin": "Chilling with Cousin",
};

/** Manual config for growing / themed albums — assign song slugs here as singles drop. */
type SeriesAlbumDef = Omit<Album, "kind"> & { kind?: never };

const SERIES_ALBUM_DEFS: SeriesAlbumDef[] = [
  {
    slug: "the-smallest-heart-album",
    title: "The Smallest Heart",
    subtitle: "The Smallest Heart · more coming",
    authorSlug: "kaia",
    coverSrc: "/assets/kaia/the-smallest-heart.jpg",
    songSlugs: ["the-smallest-heart"],
    dateCreated: "2026-06-25",
    story:
      "A growing album for Kaia — tender songs for our two-year-old, full of wonder and the biggest little heart.",
    accentColor: "#ffb7c5",
  },
  {
    slug: "three-candles-for-marceline-album",
    title: "Three Candles for Marceline",
    subtitle: "Marceline's 3rd birthday · June 21",
    authorSlug: "marceline",
    coverSrc: "/assets/marceline/three-candles-for-marceline.jpg",
    songSlugs: ["three-candles-for-marceline"],
    dateCreated: "2026-06-21",
    story:
      "A birthday release for Marceline — candles, games, and family joy as the littlest cousin turns three.",
    accentColor: "#ff9ec8",
  },
  {
    slug: "legacy-in-the-lane-album",
    title: "Legacy in the Lane",
    subtitle: "Father's Day single out now — more tracks coming",
    authorSlug: "sam-and-josh",
    coverSrc: "/assets/sam-and-josh/legacy-in-the-lane.png",
    songSlugs: ["legacy-in-the-lane"],
    dateCreated: "2026-06-21",
    story:
      "Tio Sam & Tio Josh's Father's Day series — hip-hop tributes to real superheroes who lace up sneakers, not capes.",
    accentColor: "#5eead4",
  },
  {
    slug: "gold-in-the-tile-album",
    title: "Tia Evelyn",
    subtitle: "Silver Pan Morning · Orange Sweater Sun · Gold in the Tile · more coming",
    authorSlug: "evelyn",
    coverSrc: "/assets/evelyn/silver-pan-morning.jpg",
    songSlugs: ["gold-in-the-tile", "orange-sweater-sun", "silver-pan-morning"],
    dateCreated: "2026-06-21",
    story:
      "A growing album for Tia Evelyn — indie warmth, K-pop sparkle, and new songs joining the collection as they release.",
    accentColor: "#ff8c42",
  },
  {
    slug: "smallest-of-deeds-album",
    title: "Smallest of Deeds",
    subtitle: "Tia Rachel's birthday · June 19",
    authorSlug: "rachel",
    coverSrc: "/assets/rachel/smallest-of-deeds.jpg",
    songSlugs: ["smallest-of-deeds"],
    dateCreated: "2026-06-19",
    story:
      "A birthday release for Tia Rachel — quiet kindness, small acts of love, and the light our family gathers around.",
    accentColor: "#f4a261",
  },
  {
    slug: "tia-maria-album",
    title: "Mama",
    subtitle: "Cornerstone at the Kitchen Table · more coming",
    authorSlug: "maria",
    coverSrc: "/assets/maria/cornerstone-at-the-kitchen-table.jpg",
    songSlugs: ["cornerstone-at-the-kitchen-table"],
    dateCreated: "2026-06-24",
    story:
      "A growing album for Mama — kitchen-table warmth, family cornerstone energy, and new songs joining the collection as they release.",
    accentColor: "#c9956b",
  },
  {
    slug: "miracle-in-the-sand-album",
    title: "Printing Intelligence on Sand",
    subtitle: "Miracle in the Sand · Tap on the Glass · Morning Sun Neon Light · The City Breathing · The Future in My Palm · The Room Changes the Mind · Ask Again · Cutting Through the Dark · Coherence · Children of Continuous Miracles · Return to the Morning Sun",
    authorSlug: "tio-chien",
    coverSrc: "/assets/tio-chien/miracle-in-the-sand.jpg",
    songSlugs: ["miracle-in-the-sand", "tap-on-the-glass", "morning-sun-neon-light", "the-city-breathing", "the-future-in-my-palm", "the-room-changes-the-mind", "ask-again", "cutting-through-the-dark", "coherence", "children-of-continuous-miracles", "return-to-the-morning-sun"],
    dateCreated: "2026-06-21",
    story:
      "Tio Chien's complete K-pop album — eleven tracks from sand and silicon to glass, coherence, family wonder, and the morning sun.",
    accentColor: "#f4c784",
  },
  {
    slug: "friendship-album",
    title: "Egg Rolls & Epiphanies",
    subtitle: "Teachers on the Wall · Steady Light in Your Eye · The Porch Light Glow · more coming",
    authorSlug: "tio-chien",
    coverSrc: "/assets/tio-chien/teachers-on-the-wall.jpg",
    songSlugs: ["teachers-on-the-wall", "steady-light-in-your-eye", "the-porch-light-glow"],
    dateCreated: "2026-06-24",
    story:
      "Celebrating our friendship — egg rolls, epiphanies, and new songs joining the collection as they release. Featuring Paul Savage.",
    accentColor: "#d4a574",
  },
  {
    slug: "study-lofi-album",
    title: "Study Lo-Fi",
    subtitle: "Slow Turning Pages · The Margin Notes · Rain on the Glass · Where the Garden Sleeps · more coming",
    authorSlug: "chilling-with-cousin",
    coverSrc: "/assets/chilling-with-cousin/slow-turning-pages.jpg",
    songSlugs: ["slow-turning-pages", "the-margin-notes", "rain-on-the-glass", "where-the-garden-sleeps"],
    dateCreated: "2026-06-24",
    story:
      "Instrumental study lo-fi from Chilling with Cousin — calm beats for focus, reading, and background listening.",
    accentColor: "#8b9dc3",
  },
  {
    slug: "vegetable-grooves-album",
    title: "Garden Radio: Vegetable Grooves",
    subtitle: "Sweet Potato Soul · The Mycelial Loom · 24 Karat Crunch · Spinach Spin · more coming",
    authorSlug: "tio-chien",
    coverSrc: "/assets/tio-chien/sweet-potato-soul.jpg",
    songSlugs: ["sweet-potato-soul", "the-mycelial-loom", "karat-crunch", "spinach-spin"],
    dateCreated: "2026-06-25",
    story:
      "Fresh from the garden and the grocery cart — joyful bilingual songs about vegetables, soil, sunlight, and the strange miracle of being alive.",
    accentColor: "#7cb342",
  },
  {
    slug: "fruit-frequency-album",
    title: "Garden Radio: Fruit Frequency",
    subtitle: "Watermelon Wave · Berry Brainiacs: Level Up! · more coming",
    authorSlug: "tio-chien",
    coverSrc: "/assets/tio-chien/watermelon-wave.jpg",
    songSlugs: ["watermelon-wave", "berry-brainiacs-level-up"],
    dateCreated: "2026-06-25",
    story:
      "Fruit-forward Cousin Radio — peel-back-the-sun energy, berry brainiacs, and watermelon waves made with kids, joy, and a little cart-pushing magic.",
    accentColor: "#ff7043",
  },
];

function sortSongsByTrackOrder(items: Song[]): Song[] {
  return [...items].sort((a, b) => {
    const dateCmp = a.dateCreated.localeCompare(b.dateCreated);
    return dateCmp !== 0 ? dateCmp : a.title.localeCompare(b.title);
  });
}

function buildSeriesAlbums(): Album[] {
  return SERIES_ALBUM_DEFS.map((def) => ({ ...def, kind: "series" as const }));
}

function getSeriesSongSlugs(): Set<string> {
  const slugs = new Set<string>();
  for (const def of SERIES_ALBUM_DEFS) {
    for (const slug of def.songSlugs) {
      slugs.add(slug);
    }
  }
  return slugs;
}

function buildDiscographyAlbum(member: FamilyMember, memberSongs: Song[]): Album | undefined {
  const seriesSlugs = getSeriesSongSlugs();
  const discographySongs = memberSongs.filter((song) => !seriesSlugs.has(song.slug));
  if (discographySongs.length === 0) return undefined;

  const ordered = sortSongsByTrackOrder(discographySongs);
  const first = ordered[0];
  if (!first) return undefined;

  return {
    slug: `${member.slug}-album`,
    kind: "discography",
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

function getSeriesRecencyDate(album: Album): string {
  const albumSongs = album.songSlugs
    .map((slug) => getSongBySlug(slug))
    .filter((song): song is Song => song !== undefined);

  if (albumSongs.length === 0) return album.dateCreated;

  return albumSongs.reduce(
    (latest, song) => (song.dateCreated > latest ? song.dateCreated : latest),
    album.dateCreated,
  );
}

function compareSeriesRecency(a: Album, b: Album): number {
  const dateCmp = getSeriesRecencyDate(b).localeCompare(getSeriesRecencyDate(a));
  if (dateCmp !== 0) return dateCmp;

  const trackCmp = b.songSlugs.length - a.songSlugs.length;
  if (trackCmp !== 0) return trackCmp;

  return b.slug.localeCompare(a.slug);
}

function sortAlbumsByRecency(albumList: Album[]): Album[] {
  return [...albumList].sort(compareSeriesRecency);
}

function pickLatestSeriesAlbum(series: Album[]): Album | undefined {
  if (series.length === 0) return undefined;
  return sortAlbumsByRecency(series)[0];
}

function pickPrimaryAlbumForAuthor(authorSlug: string, allAlbums: Album[]): Album | undefined {
  const memberAlbums = allAlbums.filter((album) => album.authorSlug === authorSlug);
  if (memberAlbums.length === 0) return undefined;
  if (memberAlbums.length === 1) return memberAlbums[0];

  const series = memberAlbums.filter((album) => album.kind === "series");
  const discography = memberAlbums.filter((album) => album.kind === "discography");

  const latestSeries = pickLatestSeriesAlbum(series);
  if (latestSeries) return latestSeries;

  return discography[0];
}

function applyFeaturedFlags(allAlbums: Album[]): Album[] {
  const primaryByAuthor = new Map<string, Album>();
  for (const member of members) {
    const primary = pickPrimaryAlbumForAuthor(member.slug, allAlbums);
    if (primary) {
      primaryByAuthor.set(member.slug, primary);
    }
  }

  return allAlbums.map((album) => ({
    ...album,
    featured: primaryByAuthor.get(album.authorSlug)?.slug === album.slug,
  }));
}

function buildAlbums(): Album[] {
  const seriesAlbums = buildSeriesAlbums();
  const discographyAlbums = members
    .map((member) => buildDiscographyAlbum(member, getSongsByAuthor(member.slug)))
    .filter((album): album is Album => album !== undefined);

  return applyFeaturedFlags([...seriesAlbums, ...discographyAlbums]);
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

/** One carousel / hero slot per artist — latest growing series, or full collection when that is all they have. */
export function getPrimaryAlbumForAuthor(authorSlug: string): Album | undefined {
  return pickPrimaryAlbumForAuthor(authorSlug, albums);
}

/** Exactly one primary album per member with songs — used by the 3D hero carousel. */
export function getPrimaryAlbums(): Album[] {
  return members
    .map((member) => getPrimaryAlbumForAuthor(member.slug))
    .filter((album): album is Album => album !== undefined);
}

export function getAlbumForSong(song: Song): Album | undefined {
  const matches = albums.filter((album) => album.songSlugs.includes(song.slug));
  return matches.find((album) => album.kind === "series") ?? matches[0];
}

export function getAlbumAuthor(album: Album): FamilyMember | undefined {
  return getMemberBySlug(album.authorSlug);
}

export function getAlbumTrackCount(album: Album): number {
  return album.songSlugs.length;
}

/** Every song belongs to at most one album. */
export function getSongAlbumAssignmentMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const album of albums) {
    for (const slug of album.songSlugs) {
      if (!map.has(slug)) {
        map.set(slug, album.slug);
      }
    }
  }
  return map;
}

export function getUnassignedSongSlugs(): string[] {
  const assigned = getSongAlbumAssignmentMap();
  return songs.map((song) => song.slug).filter((slug) => !assigned.has(slug));
}

export function getSeriesAlbums(): Album[] {
  return albums.filter((album) => album.kind === "series");
}

export function getDiscographyAlbums(): Album[] {
  return albums.filter((album) => album.kind === "discography");
}

export function getAlbumKindLabel(album: Album): string {
  return album.kind === "series" ? "Growing series" : "Full collection";
}

export type BrowseAlbumSection = {
  id: "series" | "discography";
  title: string;
  subtitle: string;
  albums: Album[];
};

/**
 * Growing-series browse set — themed series plus solo full collections for cousins
 * who do not have a dedicated series yet (so everyone appears in Growing series).
 */
export function getGrowingSeriesAlbums(): Album[] {
  const series = albums.filter((album) => album.kind === "series");
  const authorsWithSeries = new Set(series.map((album) => album.authorSlug));
  const soloCollections = albums.filter(
    (album) => album.kind === "discography" && !authorsWithSeries.has(album.authorSlug),
  );

  return sortAlbumsByRecency([...series, ...soloCollections]);
}

/** Browse page sections — growing series first, then extra full collections. */
export function getBrowseAlbumSections(): BrowseAlbumSection[] {
  const growing = getGrowingSeriesAlbums();
  const authorsWithSeries = new Set(getSeriesAlbums().map((album) => album.authorSlug));
  const discography = getDiscographyAlbums().filter((album) =>
    authorsWithSeries.has(album.authorSlug),
  );

  return [
    {
      id: "series" as const,
      title: "Growing series",
      subtitle: "Every cousin's latest growing album — new singles drop over time",
      albums: growing,
    },
    {
      id: "discography" as const,
      title: "Full collections",
      subtitle: "Every song from each family member in one place",
      albums: discography,
    },
  ].filter((section) => section.albums.length > 0);
}

/** Extra growing albums beyond each artist's primary hero slot (e.g. older Tio Chien series). */
export function getSupplementarySeriesAlbums(): Album[] {
  const primarySlugs = new Set(getPrimaryAlbums().map((album) => album.slug));
  return sortAlbumsByRecency(getGrowingSeriesAlbums().filter((album) => !primarySlugs.has(album.slug)));
}

export function groupAlbumsByKind(authorAlbums: Album[]): {
  series: Album[];
  discography: Album[];
} {
  return {
    series: authorAlbums.filter((album) => album.kind === "series"),
    discography: authorAlbums.filter((album) => album.kind === "discography"),
  };
}
