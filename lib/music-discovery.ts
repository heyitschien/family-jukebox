import { getAlbumSongs, type Album } from "@/data/albums";
import { members, type FamilyMember } from "@/data/members";
import { getSongsByAuthor, songs, type Song } from "@/data/songs";

const DEFAULT_SONG_LIMIT = 6;
const DEFAULT_MEMBER_LIMIT = 5;

function countSharedTags(seedTags: Set<string>, candidateTags: string[]): number {
  return candidateTags.reduce((count, tag) => count + (seedTags.has(tag) ? 1 : 0), 0);
}

function sortSongsByScore(items: Song[], getScore: (song: Song) => number): Song[] {
  return [...items].sort((a, b) => {
    const scoreDiff = getScore(b) - getScore(a);
    if (scoreDiff !== 0) return scoreDiff;

    const dateDiff = b.dateCreated.localeCompare(a.dateCreated);
    if (dateDiff !== 0) return dateDiff;

    return a.title.localeCompare(b.title);
  });
}

function uniqueSongs(items: Song[]): Song[] {
  const seen = new Set<string>();
  return items.filter((song) => {
    if (seen.has(song.slug)) return false;
    seen.add(song.slug);
    return true;
  });
}

export function getMoreSongsFromArtist(
  authorSlug: string,
  excludeSlugs: string[] = [],
  limit = DEFAULT_SONG_LIMIT,
): Song[] {
  const blocked = new Set(excludeSlugs);

  return getSongsByAuthor(authorSlug)
    .filter((song) => !blocked.has(song.slug))
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated) || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function getSimilarSongsForSong(song: Song, limit = DEFAULT_SONG_LIMIT): Song[] {
  const seedTags = new Set(song.tags);
  const otherArtists = songs.filter(
    (candidate) => candidate.slug !== song.slug && candidate.authorSlug !== song.authorSlug,
  );

  const scored = sortSongsByScore(
    otherArtists.filter((candidate) => countSharedTags(seedTags, candidate.tags) > 0),
    (candidate) => countSharedTags(seedTags, candidate.tags) * 10 + (candidate.featured ? 1 : 0),
  );

  if (scored.length >= limit) {
    return scored.slice(0, limit);
  }

  const fallback = otherArtists
    .filter((candidate) => !scored.some((entry) => entry.slug === candidate.slug))
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated) || a.title.localeCompare(b.title));

  return uniqueSongs([...scored, ...fallback]).slice(0, limit);
}

export function getSimilarSongsForAlbum(album: Album, limit = DEFAULT_SONG_LIMIT): Song[] {
  const albumSongs = getAlbumSongs(album);
  if (albumSongs.length === 0) return [];

  const blockedSongSlugs = new Set(albumSongs.map((song) => song.slug));
  const seedTags = new Set(albumSongs.flatMap((song) => song.tags));
  const otherArtists = songs.filter(
    (candidate) => !blockedSongSlugs.has(candidate.slug) && candidate.authorSlug !== album.authorSlug,
  );

  const scored = sortSongsByScore(
    otherArtists.filter((candidate) => countSharedTags(seedTags, candidate.tags) > 0),
    (candidate) => countSharedTags(seedTags, candidate.tags) * 10 + (candidate.featured ? 1 : 0),
  );

  if (scored.length >= limit) {
    return scored.slice(0, limit);
  }

  const fallback = otherArtists
    .filter((candidate) => !scored.some((entry) => entry.slug === candidate.slug))
    .sort((a, b) => b.dateCreated.localeCompare(a.dateCreated) || a.title.localeCompare(b.title));

  return uniqueSongs([...scored, ...fallback]).slice(0, limit);
}

export function getSimilarSongsForAuthor(
  authorSlug: string,
  limit = DEFAULT_SONG_LIMIT,
): Song[] {
  const artistSongs = getSongsByAuthor(authorSlug);
  if (artistSongs.length === 0) return [];

  return uniqueSongs(artistSongs.flatMap((song) => getSimilarSongsForSong(song, limit))).slice(
    0,
    limit,
  );
}

export function getRelatedMembersForSongs(
  seedSongs: Song[],
  excludeMemberSlugs: string[] = [],
  limit = DEFAULT_MEMBER_LIMIT,
): FamilyMember[] {
  if (seedSongs.length === 0) return [];

  const seedTags = new Set(seedSongs.flatMap((song) => song.tags));
  const blocked = new Set([...excludeMemberSlugs, ...seedSongs.map((song) => song.authorSlug)]);

  return members
    .filter((member) => !blocked.has(member.slug))
    .map((member) => {
      const memberSongs = getSongsByAuthor(member.slug);
      const overlapScore = memberSongs.reduce(
        (score, song) => score + countSharedTags(seedTags, song.tags),
        0,
      );

      return {
        member,
        songCount: memberSongs.length,
        overlapScore,
      };
    })
    .filter((entry) => entry.songCount > 0)
    .sort((a, b) => {
      const overlapDiff = b.overlapScore - a.overlapScore;
      if (overlapDiff !== 0) return overlapDiff;

      const songCountDiff = b.songCount - a.songCount;
      if (songCountDiff !== 0) return songCountDiff;

      return a.member.name.localeCompare(b.member.name);
    })
    .map((entry) => entry.member)
    .slice(0, limit);
}

export function getRelatedMembersForSong(song: Song, limit = DEFAULT_MEMBER_LIMIT): FamilyMember[] {
  return getRelatedMembersForSongs([song], [song.authorSlug], limit);
}

export function getRelatedMembersForAlbum(album: Album, limit = DEFAULT_MEMBER_LIMIT): FamilyMember[] {
  return getRelatedMembersForSongs(getAlbumSongs(album), [album.authorSlug], limit);
}

export function getRelatedMembersForAuthor(
  authorSlug: string,
  limit = DEFAULT_MEMBER_LIMIT,
): FamilyMember[] {
  return getRelatedMembersForSongs(getSongsByAuthor(authorSlug), [authorSlug], limit);
}
