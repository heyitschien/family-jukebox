import { albums, getAlbumAuthor, type Album } from "@/data/albums";
import { members, type FamilyMember } from "@/data/members";
import { songs, type Song } from "@/data/songs";

export type SearchResultKind = "member" | "album" | "song";

export type SearchResult =
  | { kind: "member"; member: FamilyMember; score: number; href: string }
  | { kind: "album"; album: Album; score: number; href: string }
  | { kind: "song"; song: Song; score: number; href: string };

export type GroupedSearchResults = {
  members: Extract<SearchResult, { kind: "member" }>[];
  albums: Extract<SearchResult, { kind: "album" }>[];
  songs: Extract<SearchResult, { kind: "song" }>[];
};

export type SearchFilters = {
  memberSlug?: string | null;
  age?: number | null;
  tag?: string | null;
};

function scoreText(text: string, query: string): number {
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  if (!needle) return 0;
  if (haystack === needle) return 100;
  if (haystack.startsWith(needle)) return 80;
  if (haystack.includes(needle)) return 55;
  return 0;
}

function bestScore(fields: string[], query: string): number {
  return fields.reduce((best, field) => Math.max(best, scoreText(field, query)), 0);
}

function songFields(song: Song): string[] {
  const author = members.find((member) => member.slug === song.authorSlug);
  return [
    song.title,
    song.subtitle ?? "",
    author?.name ?? "",
    author ? String(author.age) : "",
    ...song.tags,
  ];
}

function albumFields(album: Album): string[] {
  const author = getAlbumAuthor(album);
  return [album.title, album.subtitle ?? "", author?.name ?? "", ...album.songSlugs];
}

function memberFields(member: FamilyMember): string[] {
  return [member.name, member.slug, member.description, String(member.age), member.role];
}

function passesFilters(
  authorSlug: string | undefined,
  tags: string[] | undefined,
  authorAge: number | undefined,
  filters: SearchFilters,
): boolean {
  if (filters.memberSlug && authorSlug !== filters.memberSlug) return false;
  if (filters.age != null && authorAge !== filters.age) return false;
  if (filters.tag && tags && !tags.includes(filters.tag)) return false;
  return true;
}

export function searchCatalog(query: string, filters: SearchFilters = {}): SearchResult[] {
  const trimmed = query.trim();
  const results: SearchResult[] = [];

  for (const member of members) {
    if (!passesFilters(member.slug, undefined, member.age, filters)) continue;
    const score = trimmed ? bestScore(memberFields(member), trimmed) : 40;
    if (score > 0 || !trimmed) {
      results.push({
        kind: "member",
        member,
        score: trimmed ? score : 40 - members.indexOf(member),
        href: `/members/${member.slug}`,
      });
    }
  }

  for (const album of albums) {
    const author = getAlbumAuthor(album);
    if (!passesFilters(album.authorSlug, undefined, author?.age, filters)) continue;
    const score = trimmed ? bestScore(albumFields(album), trimmed) : 35;
    if (score > 0 || !trimmed) {
      results.push({
        kind: "album",
        album,
        score: trimmed ? score : 35 - albums.indexOf(album),
        href: `/albums/${album.slug}`,
      });
    }
  }

  for (const song of songs) {
    const author = members.find((member) => member.slug === song.authorSlug);
    if (!passesFilters(song.authorSlug, song.tags, author?.age, filters)) continue;
    const score = trimmed ? bestScore(songFields(song), trimmed) : 30;
    if (score > 0 || !trimmed) {
      results.push({
        kind: "song",
        song,
        score: trimmed ? score : 30 - songs.indexOf(song),
        href: `/songs/${song.slug}`,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.kind.localeCompare(b.kind));
}

export function groupSearchResults(results: SearchResult[]): GroupedSearchResults {
  return {
    members: results.filter((result): result is Extract<SearchResult, { kind: "member" }> => result.kind === "member"),
    albums: results.filter((result): result is Extract<SearchResult, { kind: "album" }> => result.kind === "album"),
    songs: results.filter((result): result is Extract<SearchResult, { kind: "song" }> => result.kind === "song"),
  };
}

export function getInlineSearchResults(query: string, filters: SearchFilters = {}): GroupedSearchResults {
  const all = searchCatalog(query, filters);
  const grouped = groupSearchResults(all);

  return {
    members: grouped.members.slice(0, 3),
    albums: grouped.albums.slice(0, 3),
    songs: grouped.songs.slice(0, 6),
  };
}

export function flattenGroupedResults(grouped: GroupedSearchResults): SearchResult[] {
  return [...grouped.members, ...grouped.albums, ...grouped.songs];
}

export function filterSongs(query: string, filters: SearchFilters = {}): Song[] {
  return searchCatalog(query, filters)
    .filter((result): result is Extract<SearchResult, { kind: "song" }> => result.kind === "song")
    .map((result) => result.song);
}

export function filterAlbums(query: string, filters: SearchFilters = {}): Album[] {
  return searchCatalog(query, filters)
    .filter((result): result is Extract<SearchResult, { kind: "album" }> => result.kind === "album")
    .map((result) => result.album);
}

export function highlightMatch(text: string, query: string): { before: string; match: string; after: string } | null {
  const needle = query.trim();
  if (!needle) return null;
  const lower = text.toLowerCase();
  const index = lower.indexOf(needle.toLowerCase());
  if (index < 0) return null;
  return {
    before: text.slice(0, index),
    match: text.slice(index, index + needle.length),
    after: text.slice(index + needle.length),
  };
}
