"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const FAVORITE_STORAGE_KEY = "family-jukebox:favorites";
const FAVORITES_CHANGED_EVENT = "family-jukebox:favorites:changed";

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

function getStoredFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];
  return parseFavoriteSlugs(window.localStorage.getItem(FAVORITE_STORAGE_KEY));
}

function writeFavoriteSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(normalizeFavoriteSlugs(slugs)));
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

export function useFavoriteSongs() {
  const favoriteSlugs = useSyncExternalStore(
    subscribeToFavoriteChanges,
    getStoredFavoriteSlugs,
    () => [],
  );
  const favoriteSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const isFavorite = useCallback((slug: string) => favoriteSet.has(slug), [favoriteSet]);

  const toggleFavorite = useCallback((slug: string) => {
    const normalizedSlug = slug.trim();
    if (!normalizedSlug) return;

    const current = getStoredFavoriteSlugs();
    const isAlreadyFavorite = current.includes(normalizedSlug);
    const next = isAlreadyFavorite
      ? current.filter((entry) => entry !== normalizedSlug)
      : [...current, normalizedSlug];

    writeFavoriteSlugs(next);
  }, []);

  return {
    favoriteSlugs,
    favoriteSet,
    isFavorite,
    toggleFavorite,
  };
}
