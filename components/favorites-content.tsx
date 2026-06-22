"use client";

import { EmptyState } from "@/components/empty-state";
import { SongShelf } from "@/components/song-shelf";
import { useFavorites } from "@/contexts/favorites-context";

export function FavoritesContent() {
  const { favoriteSongs, isHydrated } = useFavorites();

  if (!isHydrated) {
    return (
      <div className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-8 text-center text-sm font-bold text-[var(--jb-muted)]">
        Loading your favorites…
      </div>
    );
  }

  if (favoriteSongs.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the heart on any song to save it here. Your picks stay on this device — no account needed."
      />
    );
  }

  return (
    <SongShelf
      songs={favoriteSongs}
      title={`${favoriteSongs.length} saved ${favoriteSongs.length === 1 ? "song" : "songs"}`}
      subtitle="Stored locally in your browser"
    />
  );
}
