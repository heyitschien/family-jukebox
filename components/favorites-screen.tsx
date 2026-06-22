"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useMemo } from "react";

import { EmptyState } from "@/components/empty-state";
import { SongRow } from "@/components/song-row";
import { useFavorites } from "@/contexts/favorites-context";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type FavoritesScreenProps = {
  songs: Song[];
};

export function FavoritesScreen({ songs }: FavoritesScreenProps) {
  const { favoriteSlugs, hasHydrated } = useFavorites();
  const { playQueue } = usePlayer();

  const songBySlug = useMemo(
    () => new Map(songs.map((song) => [song.slug, song])),
    [songs],
  );

  const favoriteSongs = useMemo(
    () =>
      [...favoriteSlugs]
        .reverse()
        .map((slug) => songBySlug.get(slug))
        .filter((song): song is Song => Boolean(song)),
    [favoriteSlugs, songBySlug],
  );

  if (!hasHydrated) {
    return (
      <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-family-soft text-family-glow">
          <Heart className="size-7" />
        </span>
        <h2 className="mt-4 text-xl font-bold">Loading favorites...</h2>
        <p className="mt-2 text-sm font-bold text-[var(--jb-muted)]">
          Checking the songs saved on this browser.
        </p>
      </section>
    );
  }

  if (favoriteSongs.length === 0) {
    return (
      <section className="space-y-4">
        <EmptyState
          title="No favorites yet"
          description="Tap the heart on any song to save it here on this browser."
        />
        <div className="flex justify-center">
          <Link
            href="/songs"
            className="inline-flex min-h-11 items-center rounded-full bg-family-accent px-5 py-3 text-sm font-black text-[#1a0812]"
          >
            Browse songs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,111,177,0.24)] bg-family-soft px-3 py-1.5 text-xs font-black text-family-glow">
            <Heart className="size-3.5 fill-current" />
            {favoriteSongs.length} saved
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight">Your favorite songs</h2>
          <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
            Saved only on this browser. Unheart a song and it leaves this list.
          </p>
        </div>
        {favoriteSongs.length > 1 ? (
          <button
            type="button"
            onClick={() => playQueue(favoriteSongs, 0)}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-family-accent px-4 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
          >
            Play favorites
          </button>
        ) : null}
      </div>

      <div className="grid gap-2">
        {favoriteSongs.map((song, index) => (
          <SongRow
            key={song.slug}
            song={song}
            index={index}
            showIndex
            playlist={favoriteSongs}
          />
        ))}
      </div>
    </section>
  );
}
