import { albums, getAlbumsByAuthor, type Album } from "@/data/albums";
import { members } from "@/data/members";
import { songs, type Song } from "@/data/songs";

const GENERIC_TAGS = new Set(["single", "featured"]);

function meaningfulTags(song: Song): string[] {
  return song.tags.filter((tag) => !GENERIC_TAGS.has(tag) && tag !== song.authorSlug);
}

function tagOverlapScore(a: Song, b: Song): number {
  const aTags = new Set(meaningfulTags(a));
  const bTags = meaningfulTags(b);
  return bTags.filter((tag) => aTags.has(tag)).length;
}

/** Other songs by the same artist, excluding the current one. */
export function getMoreFromArtist(song: Song, limit = 6): Song[] {
  return songs
    .filter((entry) => entry.authorSlug === song.authorSlug && entry.slug !== song.slug)
    .slice(0, limit);
}

/** Songs from other artists that share tags — Spotify-style "similar vibes". */
export function getSimilarSongs(song: Song, limit = 6): Song[] {
  return songs
    .filter((entry) => entry.slug !== song.slug && entry.authorSlug !== song.authorSlug)
    .map((entry) => ({ song: entry, score: tagOverlapScore(song, entry) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.song.title.localeCompare(b.song.title))
    .slice(0, limit)
    .map((entry) => entry.song);
}

/** Fallback when no tag overlap — rotate through other artists' songs. */
export function getDiscoverSongs(excludeSlugs: string[] = [], limit = 6): Song[] {
  const excluded = new Set(excludeSlugs);
  return songs.filter((song) => !excluded.has(song.slug)).slice(0, limit);
}

export function getRelatedAlbums(album: Album, limit = 6): Album[] {
  return getAlbumsByAuthor(album.authorSlug)
    .filter((entry) => entry.slug !== album.slug)
    .slice(0, limit);
}

/** Albums from other family members — keeps users moving through the catalog. */
export function getDiscoverAlbums(excludeSlugs: string[] = [], limit = 6): Album[] {
  const excluded = new Set(excludeSlugs);
  return albums.filter((album) => !excluded.has(album.slug)).slice(0, limit);
}

/** Other artists to explore — excludes the current member. */
export function getDiscoverMembers(excludeSlug?: string, limit = 6) {
  return members
    .filter((member) => member.slug !== excludeSlug && songs.some((song) => song.authorSlug === member.slug))
    .slice(0, limit);
}

/** Songs from other artists that share tags with any track on an album. */
export function getSimilarSongsForAlbum(album: Album, albumSongs: Song[], limit = 6): Song[] {
  const excludeSlugs = new Set(album.songSlugs);
  const seen = new Set<string>();
  const results: Song[] = [];

  for (const song of albumSongs) {
    for (const similar of getSimilarSongs(song, limit)) {
      if (!excludeSlugs.has(similar.slug) && !seen.has(similar.slug)) {
        seen.add(similar.slug);
        results.push(similar);
      }
    }
  }

  if (results.length < limit) {
    for (const song of getDiscoverSongs([...excludeSlugs, ...results.map((entry) => entry.slug)], limit)) {
      if (!seen.has(song.slug)) {
        seen.add(song.slug);
        results.push(song);
      }
    }
  }

  return results.slice(0, limit);
}

/** Songs on the same album, excluding the current track. */
export function getMoreFromAlbum(song: Song, albumSongs: Song[], limit = 6): Song[] {
  return albumSongs.filter((entry) => entry.slug !== song.slug).slice(0, limit);
}
