import type { Song } from "@/data/songs";

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/**
 * Greedy artist-diversity shuffle.
 * Pins the start song, then picks each next track to maximize author spacing.
 */
export function buildSmartShuffledQueue(songs: Song[], startIndex: number): Song[] {
  if (songs.length <= 1) return [...songs];

  const clamped = Math.min(Math.max(startIndex, 0), songs.length - 1);
  const startSong = songs[clamped];
  const pool = songs.filter((_, index) => index !== clamped);
  const result: Song[] = [startSong];
  let previousAuthor = startSong.authorSlug;

  while (pool.length > 0) {
    const differentAuthor = pool.filter((song) => song.authorSlug !== previousAuthor);
    const candidates = differentAuthor.length > 0 ? differentAuthor : pool;
    const pickIndex = Math.floor(Math.random() * candidates.length);
    const picked = candidates[pickIndex];
    const poolIndex = pool.findIndex((song) => song.slug === picked.slug);
    if (poolIndex >= 0) {
      pool.splice(poolIndex, 1);
    }
    result.push(picked);
    previousAuthor = picked.authorSlug;
  }

  return result;
}

/** Reshuffle remaining tracks with artist diversity while keeping current song first. */
export function smartReshuffleFromCurrent(original: Song[], currentSlug: string): Song[] {
  if (original.length <= 1) return [...original];

  const currentIdx = original.findIndex((song) => song.slug === currentSlug);
  if (currentIdx < 0) return buildSmartShuffledQueue(original, 0);

  const current = original[currentIdx];
  const rest = [...original.slice(0, currentIdx), ...original.slice(currentIdx + 1)];
  shuffleInPlace(rest);

  const reordered = [current, ...rest];
  return buildSmartShuffledQueue(reordered, 0);
}
