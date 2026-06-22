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

import { getSongsBySlugs, type Song } from "@/data/songs";
import { readFavoriteSlugs, writeFavoriteSlugs } from "@/lib/favorites-storage";

type FavoritesContextValue = {
  favoriteSlugs: string[];
  favoriteSongs: Song[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  isHydrated: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setFavoriteSlugs(readFavoriteSlugs());
    setIsHydrated(true);
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavoriteSlugs((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [slug, ...prev];
      writeFavoriteSlugs(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => favoriteSlugs.includes(slug),
    [favoriteSlugs],
  );

  const favoriteSongs = useMemo(
    () => getSongsBySlugs(favoriteSlugs),
    [favoriteSlugs],
  );

  const value = useMemo(
    () => ({
      favoriteSlugs,
      favoriteSongs,
      isFavorite,
      toggleFavorite,
      isHydrated,
    }),
    [favoriteSlugs, favoriteSongs, isFavorite, toggleFavorite, isHydrated],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
