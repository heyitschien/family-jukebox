"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
  EMPTY_FAVORITE_SLUGS,
  FAVORITES_CHANGED_EVENT,
  FAVORITE_STORAGE_KEY,
  readFavoriteSlugsFromRaw,
  serializeFavoriteSlugs,
  type FavoriteSnapshotCache,
} from "@/lib/favorites-storage";

const favoriteSnapshotCache: { current: FavoriteSnapshotCache } = { current: null };

function getStoredFavoriteSlugs(): readonly string[] {
  if (typeof window === "undefined") return EMPTY_FAVORITE_SLUGS;

  const raw = window.localStorage.getItem(FAVORITE_STORAGE_KEY);
  return readFavoriteSlugsFromRaw(raw, favoriteSnapshotCache);
}

function writeFavoriteSlugs(slugs: string[]): void {
  if (typeof window === "undefined") return;

  const { serialized, snapshot } = serializeFavoriteSlugs(slugs);
  window.localStorage.setItem(FAVORITE_STORAGE_KEY, serialized);
  favoriteSnapshotCache.current = { raw: serialized, slugs: snapshot };
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
