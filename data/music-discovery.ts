import {
  albums,
  getAlbumForSong,
  getAlbumSongs,
  getAlbumsByAuthor,
  type Album,
} from "@/data/albums";
import { members, type FamilyMember } from "@/data/members";
import { getSongsByAuthor, songs, type Song } from "@/data/songs";

function uniqueBySlug<T extends { slug: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (seen.has(item.slug)) continue;
    seen.add(item.slug);
    unique.push(item);
  }

  return unique;
}

function byNewestThenTitle(a: Song, b: Song): number {
  const dateCmp = b.dateCreated.localeCompare(a.dateCreated);
  return dateCmp !== 0 ? dateCmp : a.title.localeCompare(b.title);
}

function sharedTagCount(song: Song, tags: Set<string>): number {
  return song.tags.reduce((count, tag) => count + (tags.has(tag) ? 1 : 0), 0);
}

function rankedSongs(
  candidates: Song[],
  score: (song: Song) => number,
  limit: number,
): Song[] {
  return candidates
    .map((song) => ({ song, score: score(song) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || byNewestThenTitle(a.song, b.song))
    .map((entry) => entry.song)
    .slice(0, limit);
}

function fillSongs(primary: Song[], fallback: Song[], limit: number): Song[] {
  return uniqueBySlug([...primary, ...fallback]).slice(0, limit);
}

export function getMoreSongsByAuthor(
  authorSlug: string,
  excludedSlugs: string[] = [],
  limit = 6,
): Song[] {
  const excluded = new Set(excludedSlugs);
  return getSongsByAuthor(authorSlug)
    .filter((song) => !excluded.has(song.slug))
    .sort(byNewestThenTitle)
    .slice(0, limit);
}

export function getRelatedSongsForAlbum(album: Album, limit = 6): Song[] {
  const albumSongs = getAlbumSongs(album);
  const albumSlugs = new Set(albumSongs.map((song) => song.slug));
  const albumTags = new Set(albumSongs.flatMap((song) => song.tags));
  const candidates = songs.filter((song) => !albumSlugs.has(song.slug));

  const ranked = rankedSongs(
    candidates,
    (song) =>
      (song.authorSlug === album.authorSlug ? 4 : 0) +
      sharedTagCount(song, albumTags) * 2 +
      (song.featured ? 1 : 0),
    limit,
  );

  return fillSongs(ranked, candidates.sort(byNewestThenTitle), limit);
}

export function getSimilarSongsForSong(song: Song, limit = 6): Song[] {
  const tags = new Set(song.tags);
  const candidates = songs.filter((candidate) => candidate.slug !== song.slug);

  const ranked = rankedSongs(
    candidates,
    (candidate) =>
      sharedTagCount(candidate, tags) * 3 +
      (candidate.authorSlug !== song.authorSlug ? 2 : 1) +
      (candidate.featured ? 1 : 0),
    limit,
  );

  return fillSongs(ranked, candidates.sort(byNewestThenTitle), limit);
}

export function getRelatedAlbumsForAlbum(album: Album, limit = 6): Album[] {
  const albumSongs = getAlbumSongs(album);
  const albumTags = new Set(albumSongs.flatMap((song) => song.tags));
  const sameArtist = getAlbumsByAuthor(album.authorSlug).filter((entry) => entry.slug !== album.slug);
  const otherAlbums = albums
    .filter((entry) => entry.slug !== album.slug && entry.authorSlug !== album.authorSlug)
    .map((entry) => {
      const songsForAlbum = getAlbumSongs(entry);
      const sharedTags = songsForAlbum.reduce(
        (count, song) => count + sharedTagCount(song, albumTags),
        0,
      );
      return {
        album: entry,
        score: sharedTags + (entry.featured ? 2 : 0) + Math.min(songsForAlbum.length, 4),
      };
    })
    .sort((a, b) => b.score - a.score || a.album.title.localeCompare(b.album.title))
    .map((entry) => entry.album);

  return uniqueBySlug([...sameArtist, ...otherAlbums]).slice(0, limit);
}

export function getRelatedAlbumsForSong(song: Song, limit = 6): Album[] {
  const parentAlbum = getAlbumForSong(song);
  const sameArtist = getAlbumsByAuthor(song.authorSlug);
  const tags = new Set(song.tags);
  const related = albums
    .filter((album) => album.slug !== parentAlbum?.slug)
    .map((album) => {
      const albumSongs = getAlbumSongs(album);
      const score =
        (album.authorSlug === song.authorSlug ? 4 : 0) +
        albumSongs.reduce((count, entry) => count + sharedTagCount(entry, tags), 0) +
        (album.featured ? 2 : 0);
      return { album, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.album.title.localeCompare(b.album.title))
    .map((entry) => entry.album);

  return uniqueBySlug([
    ...(parentAlbum ? [parentAlbum] : []),
    ...sameArtist,
    ...related,
    ...albums,
  ]).slice(0, limit);
}

export function getNeighborMembers(authorSlug: string, limit = 5): FamilyMember[] {
  const artistsWithSongs = members.filter((member) =>
    songs.some((song) => song.authorSlug === member.slug),
  );
  const currentIndex = artistsWithSongs.findIndex((member) => member.slug === authorSlug);
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;
  const rotated = [
    ...artistsWithSongs.slice(startIndex),
    ...artistsWithSongs.slice(0, startIndex),
  ];

  return rotated.filter((member) => member.slug !== authorSlug).slice(0, limit);
}
