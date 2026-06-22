import type { Song } from "@/data/songs";
import { buildIntelligentQueue, scoreSongsForSeed } from "@/lib/music-intelligence";
import { getFairRotationQueue } from "@/lib/featured-rotation";
import {
  getRecentlyPlayedSlugs,
  readSessionListening,
  type SessionListeningSnapshot,
} from "@/lib/session-listening";

export const RADIO_BATCH_SIZE = 6;
export const RADIO_RECENCY_WINDOW = 5;

export type RadioContext = {
  session?: SessionListeningSnapshot;
  refreshSeed?: number;
  batchSize?: number;
  listenerAge?: number | null;
};

/**
 * Build the next batch of tracks for Cousin Radio endless mode.
 * Seeds from the last played song; excludes recent session plays.
 */
export function buildRadioContinuation(
  seed: Song,
  context: RadioContext = {},
): Song[] {
  const batchSize = context.batchSize ?? RADIO_BATCH_SIZE;
  const session = context.session ?? readSessionListening();
  const recentSlugs = new Set(getRecentlyPlayedSlugs(RADIO_RECENCY_WINDOW));
  recentSlugs.add(seed.slug);

  const excludeSlugs = new Set(recentSlugs);
  const scored = scoreSongsForSeed(seed, {
    session,
    excludeSlugs,
    listenerAge: context.listenerAge,
  });

  const picks: Song[] = [];
  const seen = new Set<string>([seed.slug]);

  for (const entry of scored) {
    if (picks.length >= batchSize) break;
    if (seen.has(entry.song.slug)) continue;
    seen.add(entry.song.slug);
    picks.push(entry.song);
  }

  // Fair family interleave for remaining slots.
  if (picks.length < batchSize) {
    const fair = getFairRotationQueue(context.refreshSeed ?? 0);
    for (const song of fair) {
      if (picks.length >= batchSize) break;
      if (seen.has(song.slug) || recentSlugs.has(song.slug)) continue;
      seen.add(song.slug);
      picks.push(song);
    }
  }

  // Intelligent queue as final fallback.
  if (picks.length < batchSize) {
    const intelligent = buildIntelligentQueue(seed, {
      limit: batchSize + 1,
      context: {
        session,
        excludeSlugs: seen,
        refreshSeed: context.refreshSeed,
        listenerAge: context.listenerAge,
      },
    }).filter((song) => !seen.has(song.slug) && !recentSlugs.has(song.slug));

    for (const song of intelligent) {
      if (picks.length >= batchSize) break;
      seen.add(song.slug);
      picks.push(song);
    }
  }

  return picks;
}

export function shouldContinueRadio(
  radioMode: "off" | "on",
  repeatMode: "off" | "one" | "all",
  manual: boolean,
): boolean {
  return radioMode === "on" && repeatMode === "off" && !manual;
}
