"use client";

import { useMemo } from "react";

import { EmptyState } from "@/components/empty-state";
import { SongShelf } from "@/components/song-shelf";
import { Topbar } from "@/components/topbar";
import { useFavorites } from "@/contexts/favorites-context";
import { songs, type Song } from "@/data/songs";

const songsBySlug = new Map(songs.map((song) => [song.slug, song] as const));

function isSong(value: Song | undefined): value is Song {
  return value !== undefined;
}

export function FavoritesScreen() {
  const { favoriteSlugs, favoritesCount, favoritesReady } = useFavorites();

  const favoriteSongs = useMemo(
    () => favoriteSlugs.map((slug) => songsBySlug.get(slug)).filter(isSong),
    [favoriteSlugs],
  );

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight">Favorites</h1>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.07] px-3 py-1 text-xs font-black tracking-wide text-[var(--jb-muted)] uppercase">
            {favoritesReady ? `${favoritesCount} saved` : "Syncing"}
          </span>
        </div>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Songs you heart on this browser stay here until you remove them.
        </p>
      </header>

      {!favoritesReady ? (
        <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-5">
          <p className="text-sm font-bold text-[var(--jb-muted)]">Loading your saved songs...</p>
        </section>
      ) : favoriteSongs.length > 0 ? (
        <SongShelf
          songs={favoriteSongs}
          title="Your saved songs"
          subtitle="Tap the heart again anywhere in the app to remove a song from this list."
        />
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Tap the heart on any song to save it on this device and see it here."
        />
      )}
    </main>
  );
}
