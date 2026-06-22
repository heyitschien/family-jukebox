"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const FAVORITE_STORAGE_KEY = "family-jukebox:favorites";
const FAVORITES_CHANGED_EVENT = "family-jukebox:favorites:changed";

let favoriteSnapshotCache: { raw: string | null; slugs: readonly string[] } | null = null;
const EMPTY_FAVORITE_SLUGS: readonly string[] = Object.freeze([]);

function normalizeFavoriteSlugs(slugs: string[]): string[] {
  return Array.from(
    new Set(
      slugs
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  );
}

function parseFavoriteSlugs(serialized: string | null): string[] {
  if (!serialized) return [];

  try {
    const parsed = JSON.parse(serialized);
    if (!Array.isArray(parsed)) return [];
    return normalizeFavoriteSlugs(parsed.filter((entry): entry is string => typeof entry === "string"));
  } catch {
    return [];
  }
}

function getStoredFavoriteSlugs(): readonly string[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
  if (favoriteSnapshotCache?.raw === raw) {
    return favoriteSnapshotCache.slugs;
  }

  const slugs = Object.freeze(parseFavoriteSlugs(raw));
  favoriteSnapshotCache = { raw, slugs };
  return slugs;
}

function writeFavoriteSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  const normalized = normalizeFavoriteSlugs(slugs);
  const serialized = JSON.stringify(normalized);
  window.localStorage.setItem(FAVORITE_STORAGE_KEY, serialized);
  favoriteSnapshotCache = { raw: serialized, slugs: Object.freeze(normalized) };
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}

function subscribeToFavoriteChanges(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(FAVORITES_CHANGED_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(FAVORITES_CHANGED_EVENT, handleChange);
  };
}

function subscribeNoop(): () => void {
  return () => {};
}

function useHydrated(): boolean {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function useFavoriteSongs() {
  const favoriteSlugs = useSyncExternalStore(
    subscribeToFavoriteChanges,
    getStoredFavoriteSlugs,
    () => EMPTY_FAVORITE_SLUGS,
  );
  const hydrated = useHydrated();

  // Keep SSR + first client paint identical; apply localStorage after hydration.
  const resolvedSlugs = useMemo(
    () => (hydrated ? favoriteSlugs : EMPTY_FAVORITE_SLUGS),
    [favoriteSlugs, hydrated],
  );
  const favoriteSet = useMemo(() => new Set(resolvedSlugs), [resolvedSlugs]);

  const isFavorite = useCallback((slug: string) => favoriteSet.has(slug), [favoriteSet]);

  const toggleFavorite = useCallback((slug: string) => {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return;

    const current = [...getStoredFavoriteSlugs()];
    const isAlreadyFavorite = current.includes(normalizedSlug);
    const next = isAlreadyFavorite
      ? current.filter((entry) => entry !== normalizedSlug)
      : [...current, normalizedSlug];

    writeFavoriteSlugs(next);
  }, []);

  return {
    favoriteSlugs: resolvedSlugs,
    favoriteSet,
    isFavorite,
    toggleFavorite,
    hydrated,
  };
}
