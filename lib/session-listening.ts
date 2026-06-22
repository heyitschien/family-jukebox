/** Session-scoped listening memory — powers recency-aware recommendations without accounts. */

export const SESSION_LISTENING_KEY = "family-jukebox:session-listening";
export const MAX_RECENT_SLUGS = 20;

export type SessionListeningSnapshot = {
  recentSlugs: string[];
  playCounts: Record<string, number>;
};

export const EMPTY_SESSION_SNAPSHOT: SessionListeningSnapshot = Object.freeze({
  recentSlugs: [],
  playCounts: {},
});

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readSessionListening(): SessionListeningSnapshot {
  if (!isBrowser()) return EMPTY_SESSION_SNAPSHOT;

  try {
    const raw = sessionStorage.getItem(SESSION_LISTENING_KEY);
    if (!raw) return EMPTY_SESSION_SNAPSHOT;

    const parsed = JSON.parse(raw) as Partial<SessionListeningSnapshot>;
    const recentSlugs = Array.isArray(parsed.recentSlugs)
      ? parsed.recentSlugs.filter((slug): slug is string => typeof slug === "string")
      : [];
    const playCounts =
      parsed.playCounts && typeof parsed.playCounts === "object" ? parsed.playCounts : {};

    return {
      recentSlugs: recentSlugs.slice(0, MAX_RECENT_SLUGS),
      playCounts,
    };
  } catch {
    return EMPTY_SESSION_SNAPSHOT;
  }
}

export function writeSessionListening(snapshot: SessionListeningSnapshot): void {
  if (!isBrowser()) return;

  try {
    sessionStorage.setItem(
      SESSION_LISTENING_KEY,
      JSON.stringify({
        recentSlugs: snapshot.recentSlugs.slice(0, MAX_RECENT_SLUGS),
        playCounts: snapshot.playCounts,
      }),
    );
  } catch {
    // Quota or privacy mode — listening still works without session memory.
  }
}

/** Record a play and return the updated snapshot. */
export function recordSessionPlay(songSlug: string): SessionListeningSnapshot {
  const current = readSessionListening();
  const without = current.recentSlugs.filter((slug) => slug !== songSlug);
  const recentSlugs = [songSlug, ...without].slice(0, MAX_RECENT_SLUGS);
  const playCounts = {
    ...current.playCounts,
    [songSlug]: (current.playCounts[songSlug] ?? 0) + 1,
  };

  const next = { recentSlugs, playCounts };
  writeSessionListening(next);
  return next;
}

export function getRecentlyPlayedSlugs(limit = MAX_RECENT_SLUGS): string[] {
  return readSessionListening().recentSlugs.slice(0, limit);
}

export function getSessionPlayCount(songSlug: string): number {
  return readSessionListening().playCounts[songSlug] ?? 0;
}

export function wasRecentlyPlayed(
  songSlug: string,
  withinLast = 5,
  session: SessionListeningSnapshot = readSessionListening(),
): boolean {
  const recent = session.recentSlugs.slice(0, withinLast);
  return recent.includes(songSlug);
}
