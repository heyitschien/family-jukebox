import { songs, type Song } from "@/data/songs";
import { getCelebrationSongSlugs } from "@/lib/celebrations";
import { getFairRotationQueue } from "@/lib/featured-rotation";
import { getMoreFromArtist, getSimilarSongs } from "@/lib/music-discovery";
import {
  curateSongsForAudience,
  isSongVisibleForAudience,
  scoreSongForAudience,
  scoreSongForListener,
  type FamilyAudienceId,
} from "@/lib/audience";
import type { SessionListeningSnapshot } from "@/lib/session-listening";
import { EMPTY_SESSION_SNAPSHOT } from "@/lib/session-listening";

const GENERIC_TAGS = new Set(["single", "featured"]);

export type IntelligenceContext = {
  session?: SessionListeningSnapshot;
  refreshSeed?: number;
  /** Slugs to hard-exclude (e.g. current queue). */
  excludeSlugs?: ReadonlySet<string>;
  /** Listener age — boosts age-appropriate tracks in recommendations. */
  listenerAge?: number | null;
  /** Selected family profile — filters recommendations for safe content. */
  audienceId?: FamilyAudienceId | null;
};

export type ScoredSong = {
  song: Song;
  score: number;
};

function meaningfulTags(song: Song): string[] {
  return song.tags.filter((tag) => !GENERIC_TAGS.has(tag) && tag !== song.authorSlug);
}

function tagOverlap(a: Song, b: Song): number {
  const aTags = new Set(meaningfulTags(a));
  return meaningfulTags(b).filter((tag) => aTags.has(tag)).length;
}

/** Unified affinity score — higher means better next-track candidate. */
export function scoreSongAffinity(
  seed: Song,
  candidate: Song,
  context: IntelligenceContext = {},
): number {
  if (seed.slug === candidate.slug) return -1;

  const session = context.session ?? EMPTY_SESSION_SNAPSHOT;
  let score = 0;

  // Tag overlap — primary "similar vibes" signal.
  score += tagOverlap(seed, candidate) * 40;

  // Author diversity — prefer other family members after the seed artist.
  if (candidate.authorSlug !== seed.authorSlug) {
    score += 25;
  }

  // Session freshness — deprioritize songs heard recently this session.
  const recentIndex = session.recentSlugs.indexOf(candidate.slug);
  if (recentIndex === -1) {
    score += 20;
  } else {
    score -= recentIndex * 3;
  }

  // Session play count — slight exploration boost for never-played tracks.
  const plays = session.playCounts[candidate.slug] ?? 0;
  if (plays === 0) {
    score += 5;
  } else {
    score -= Math.min(plays * 2, 10);
  }

  // Celebration / featured boosts.
  const celebrationSlugs = new Set(getCelebrationSongSlugs());
  if (celebrationSlugs.has(candidate.slug)) {
    score += 10;
  } else if (candidate.featured) {
    score += 5;
  }

  // Age-aware curation boost.
  if (context.audienceId != null) {
    if (!isSongVisibleForAudience(candidate, context.audienceId)) return -1;
    score += scoreSongForAudience(candidate, context.audienceId) * 0.15;
  }
  if (context.listenerAge != null) {
    score += scoreSongForListener(candidate, context.listenerAge) * 0.15;
  }

  return score;
}

export function rankSimilarSongs(
  seed: Song,
  limit = 6,
  context: IntelligenceContext = {},
): Song[] {
  const exclude = context.excludeSlugs ?? new Set<string>();

  return songs
    .filter(
      (song) =>
        song.slug !== seed.slug &&
        !exclude.has(song.slug) &&
        isSongVisibleForAudience(song, context.audienceId),
    )
    .map((song) => ({ song, score: scoreSongAffinity(seed, song, context) }))
    .filter((entry) => entry.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.song.title.localeCompare(b.song.title),
    )
    .slice(0, limit)
    .map((entry) => entry.song);
}

/**
 * Build an intelligent play queue from a seed song.
 * Combines similar vibes, same-artist tracks, and fair family rotation.
 */
export function buildIntelligentQueue(
  seed: Song,
  options: {
    limit?: number;
    context?: IntelligenceContext;
    includeArtistTracks?: boolean;
  } = {},
): Song[] {
  const limit = options.limit ?? 8;
  const context = options.context ?? {};
  const exclude = new Set(context.excludeSlugs ?? []);
  exclude.add(seed.slug);

  const results: Song[] = [seed];
  const seen = new Set<string>([seed.slug]);

  const addCandidates = (candidates: Song[]) => {
    for (const song of candidates) {
      if (seen.has(song.slug) || exclude.has(song.slug)) continue;
      seen.add(song.slug);
      results.push(song);
      if (results.length >= limit) return;
    }
  };

  // Similar cross-family tracks first.
  addCandidates(rankSimilarSongs(seed, limit, { ...context, excludeSlugs: seen }));

  // Same artist deep-cut if room remains.
  if (options.includeArtistTracks !== false && results.length < limit) {
    addCandidates(
      getMoreFromArtist(seed, limit).filter((song) =>
        isSongVisibleForAudience(song, context.audienceId),
      ),
    );
  }

  // Fair rotation fill for variety across the family.
  if (results.length < limit) {
    const fair = curateSongsForAudience(getFairRotationQueue(context.refreshSeed ?? 0), context.audienceId ?? null);
    addCandidates(fair);
  }

  // Last resort — any remaining catalog songs.
  if (results.length < limit) {
    addCandidates(
      songs.filter(
        (song) => !seen.has(song.slug) && isSongVisibleForAudience(song, context.audienceId),
      ),
    );
  }

  return results.slice(0, limit);
}

/** Enhanced similar songs — wraps tag overlap with intelligence scoring. */
export function getIntelligentSimilarSongs(
  seed: Song,
  limit = 6,
  context: IntelligenceContext = {},
): Song[] {
  const intelligent = rankSimilarSongs(seed, limit, context);
  if (intelligent.length >= limit) return intelligent;

  const seen = new Set(intelligent.map((song) => song.slug));
  seen.add(seed.slug);
  const fallback = getSimilarSongs(seed, limit).filter(
    (song) => !seen.has(song.slug) && isSongVisibleForAudience(song, context.audienceId),
  );
  return [...intelligent, ...fallback].slice(0, limit);
}

export function scoreSongsForSeed(
  seed: Song,
  context: IntelligenceContext = {},
): ScoredSong[] {
  return songs
    .filter((song) => song.slug !== seed.slug && isSongVisibleForAudience(song, context.audienceId))
    .map((song) => ({ song, score: scoreSongAffinity(seed, song, context) }))
    .sort((a, b) => b.score - a.score || a.song.title.localeCompare(b.song.title));
}
