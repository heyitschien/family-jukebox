/** Browser favorites storage helpers. Snapshots must stay referentially stable for useSyncExternalStore. */

export const FAVORITE_STORAGE_KEY = "family-jukebox:favorites";
export const FAVORITES_CHANGED_EVENT = "family-jukebox:favorites:changed";
export const EMPTY_FAVORITE_SLUGS: readonly string[] = Object.freeze([]);

export type FavoriteSnapshotCache = {
  raw: string | null;
  slugs: readonly string[];
} | null;

export function normalizeFavoriteSlugs(slugs: string[]): string[] {
  return Array.from(
    new Set(
      slugs
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  );
}

export function parseFavoriteSlugs(serialized: string | null): string[] {
  if (!serialized) return [];

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return [];
    return normalizeFavoriteSlugs(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return [];
  }
}

/**
 * Read favorites from localStorage JSON with referential stability.
 * useSyncExternalStore compares snapshots with Object.is — returning a fresh
 * array every call causes React error #185 (infinite update loop) in production.
 */
export function readFavoriteSlugsFromRaw(
  raw: string | null,
  cache: { current: FavoriteSnapshotCache },
): readonly string[] {
  if (cache.current?.raw === raw) {
    return cache.current.slugs;
  }

  const slugs = Object.freeze(parseFavoriteSlugs(raw));
  cache.current = { raw, slugs };
  return slugs;
}

export function serializeFavoriteSlugs(slugs: string[]): {
  serialized: string;
  snapshot: readonly string[];
} {
  const normalized = normalizeFavoriteSlugs(slugs);
  const snapshot = Object.freeze(normalized);
  return {
    serialized: JSON.stringify(normalized),
    snapshot,
  };
}
