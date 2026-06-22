"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const FAVORITES_STORAGE_KEY = "family-jukebox:favorites";

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

function readFavoriteSlugs(): string[] {
  if (typeof window === "undefined") return [];

  try {
    return parseFavoriteSlugs(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
  } catch {
    return [];
  }
}

function writeFavoriteSlugs(slugs: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // Keep in-memory favorites usable even if browser storage is unavailable.
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setFavoriteSlugs(readFavoriteSlugs());
    setHasHydrated(true);

    function handleStorage(event: StorageEvent) {
      if (event.key !== FAVORITES_STORAGE_KEY) return;
      setFavoriteSlugs(parseFavoriteSlugs(event.newValue));
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const favoriteSlugSet = useMemo(() => new Set(favoriteSlugs), [favoriteSlugs]);

  const isFavorite = useCallback(
    (songSlug: string) => favoriteSlugSet.has(songSlug),
    [favoriteSlugSet],
  );

  const addFavorite = useCallback((songSlug: string) => {
    const normalizedSlug = songSlug.trim();
    if (!normalizedSlug) return;

    setFavoriteSlugs((current) => {
      if (current.includes(normalizedSlug)) return current;
      const next = [...current, normalizedSlug];
      writeFavoriteSlugs(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((songSlug: string) => {
    setFavoriteSlugs((current) => {
      if (!current.includes(songSlug)) return current;
      const next = current.filter((slug) => slug !== songSlug);
      writeFavoriteSlugs(next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((songSlug: string) => {
    const normalizedSlug = songSlug.trim();
    if (!normalizedSlug) return;

    setFavoriteSlugs((current) => {
      const next = current.includes(normalizedSlug)
        ? current.filter((slug) => slug !== normalizedSlug)
        : [...current, normalizedSlug];
      writeFavoriteSlugs(next);
      return next;
    });
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
