"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const FAVORITES_STORAGE_KEY = "family-jukebox:favorites";
const favoriteListeners = new Set<() => void>();
const EMPTY_FAVORITES: string[] = [];

type FavoritesContextValue = {
  favoriteSlugs: string[];
  favoritesReady: boolean;
  favoritesCount: number;
  isFavorite: (songSlug: string) => boolean;
  setFavorite: (songSlug: string, nextValue: boolean) => void;
  toggleFavorite: (songSlug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function normalizeFavoriteSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const item of value) {
    if (typeof item !== "string" || item.length === 0 || seen.has(item)) continue;
    seen.add(item);
    normalized.push(item);
  }

  return normalized;
}

function readFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    return normalizeFavoriteSlugs(JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? "[]"));
  } catch {
    return [];
  }
}

function emitFavoriteChange() {
  for (const listener of favoriteListeners) {
    listener();
  }
}

function writeFavoriteSlugs(favoriteSlugs: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteSlugs));
    emitFavoriteChange();
  } catch {
    // Ignore storage write failures so favorites remain non-blocking.
  }
}

function subscribeToFavorites(listener: () => void) {
  favoriteListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== FAVORITES_STORAGE_KEY && event.key !== null) return;
    listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    favoriteListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoriteSnapshot = useSyncExternalStore<string[] | null>(
    subscribeToFavorites,
    readFavoriteSlugs,
    () => null,
  );
  const favoriteSlugs = useMemo(() => favoriteSnapshot ?? EMPTY_FAVORITES, [favoriteSnapshot]);
  const favoritesReady = favoriteSnapshot !== null;
  const favoriteSlugSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const isFavorite = useCallback(
    (songSlug: string) => favoriteSlugSet.has(songSlug),
    [favoriteSlugSet],
  );

  const setFavorite = useCallback((songSlug: string, nextValue: boolean) => {
    const current = readFavoriteSlugs();
    const alreadyFavorite = current.includes(songSlug);

    if (nextValue) {
      if (alreadyFavorite) return;
      writeFavoriteSlugs([songSlug, ...current]);
      return;
    }

    if (!alreadyFavorite) return;
    writeFavoriteSlugs(current.filter((slug) => slug !== songSlug));
  }, []);

  const toggleFavorite = useCallback((songSlug: string) => {
    const current = readFavoriteSlugs();

    writeFavoriteSlugs(
      current.includes(songSlug)
        ? current.filter((slug) => slug !== songSlug)
        : [songSlug, ...current],
    );
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favoriteSlugs,
      favoritesReady,
      favoritesCount: favoriteSlugs.length,
      isFavorite,
      setFavorite,
      toggleFavorite,
    }),
    [favoriteSlugs, favoritesReady, isFavorite, setFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}
