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
const FAVORITES_CHANGE_EVENT = "family-jukebox:favorites-change";
const EMPTY_FAVORITES_VALUE = "[]";

let fallbackFavoritesValue = EMPTY_FAVORITES_VALUE;

type FavoritesContextValue = {
  favoriteSlugs: string[];
  favoriteCount: number;
  hasHydrated: boolean;
  isFavorite: (songSlug: string) => boolean;
  addFavorite: (songSlug: string) => void;
  removeFavorite: (songSlug: string) => void;
  toggleFavorite: (songSlug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function normalizeFavoriteSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const slugs: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") continue;
    const slug = item.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push(slug);
  }

  return slugs;
}

function parseFavoriteSlugs(rawValue: string | null): string[] {
  if (!rawValue) return [];

  try {
    return normalizeFavoriteSlugs(JSON.parse(rawValue));
  } catch {
    return [];
  }
}

function readFavoritesStorageValue(): string {
  if (typeof window === "undefined") return fallbackFavoritesValue;

  try {
    return window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? EMPTY_FAVORITES_VALUE;
  } catch {
    return fallbackFavoritesValue;
  }
}

function getServerFavoritesStorageValue(): string {
  return EMPTY_FAVORITES_VALUE;
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

function subscribeToHydration() {
  return () => {};
}

function notifyFavoriteSubscribers() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

function subscribeToFavoriteStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  function handleStorage(event: StorageEvent) {
    if (event.key !== FAVORITES_STORAGE_KEY) return;
    fallbackFavoritesValue = event.newValue ?? EMPTY_FAVORITES_VALUE;
    onStoreChange();
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, onStoreChange);
  };
}

function writeFavoriteSlugs(slugs: string[]) {
  fallbackFavoritesValue = JSON.stringify(slugs);

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, fallbackFavoritesValue);
  } catch {
    // Keep in-memory favorites usable even if browser storage is unavailable.
  }

  notifyFavoriteSubscribers();
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoriteStorageValue = useSyncExternalStore(
    subscribeToFavoriteStorage,
    readFavoritesStorageValue,
    getServerFavoritesStorageValue,
  );
  const hasHydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );
  const favoriteSlugs = useMemo(
    () => parseFavoriteSlugs(favoriteStorageValue),
    [favoriteStorageValue],
  );

  const favoriteSlugSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const isFavorite = useCallback(
    (songSlug: string) => favoriteSlugSet.has(songSlug),
    [favoriteSlugSet],
  );

  const addFavorite = useCallback((songSlug: string) => {
    const normalizedSlug = songSlug.trim();
    if (!normalizedSlug) return;

    const current = parseFavoriteSlugs(readFavoritesStorageValue());
    if (current.includes(normalizedSlug)) return;
    writeFavoriteSlugs([...current, normalizedSlug]);
  }, []);

  const removeFavorite = useCallback((songSlug: string) => {
    const current = parseFavoriteSlugs(readFavoritesStorageValue());
    if (!current.includes(songSlug)) return;
    writeFavoriteSlugs(current.filter((slug) => slug !== songSlug));
  }, []);

  const toggleFavorite = useCallback((songSlug: string) => {
    const normalizedSlug = songSlug.trim();
    if (!normalizedSlug) return;

    const current = parseFavoriteSlugs(readFavoritesStorageValue());
    const next = current.includes(normalizedSlug)
      ? current.filter((slug) => slug !== normalizedSlug)
      : [...current, normalizedSlug];
    writeFavoriteSlugs(next);
  }, []);

  const value = useMemo(
    () => ({
      favoriteSlugs,
      favoriteCount: favoriteSlugs.length,
      hasHydrated,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [
      addFavorite,
      favoriteSlugs,
      hasHydrated,
      isFavorite,
      removeFavorite,
      toggleFavorite,
    ],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider");
  }

  return context;
}
