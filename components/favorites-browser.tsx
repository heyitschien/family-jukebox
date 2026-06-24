"use client";

import { Heart, Shuffle } from "lucide-react";
import { useMemo } from "react";

import { EmptyState } from "@/components/empty-state";
import { SongRow } from "@/components/song-row";
import { usePlayer } from "@/contexts/player-context";
import { songs } from "@/data/songs";
import { useFavoriteSongs } from "@/hooks/use-favorite-songs";
import { buildSmartShuffledQueue } from "@/lib/smart-shuffle";
import { cn } from "@/lib/utils";

export function FavoritesBrowser() {
  const { favoriteSet } = useFavoriteSongs();
  const { playQueue } = usePlayer();

  const favoriteSongs = useMemo(
    () => songs.filter((song) => favoriteSet.has(song.slug)),
    [favoriteSet],
  );

  if (favoriteSongs.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Tap the heart on any song or in the player, then your picks show up here."
      />
    );
  }

  const canPlayAll = favoriteSongs.length >= 2;

  const playFavoritesShuffled = () => {
    const shuffled = buildSmartShuffledQueue(favoriteSongs, 0);
    playQueue(shuffled, 0, "shelf");
  };

  const playFavoritesInOrder = () => {
    playQueue(favoriteSongs, 0, "shelf");
  };

  return (
    <section className="jb-float-panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-2xl bg-cr-soft text-[var(--cr-pink)]">
            <Heart className="size-5 fill-current" aria-hidden />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-base font-extrabold sm:text-lg">Your playlist</h2>
            <p className="text-xs font-semibold text-[var(--jb-muted)]">
              {favoriteSongs.length} {favoriteSongs.length === 1 ? "song" : "songs"} · saved on this
              browser
            </p>
          </div>
        </div>

        {canPlayAll ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={playFavoritesShuffled}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-family-accent px-3.5 py-2 text-xs font-black text-[#1a0812] shadow-family sm:min-h-10 sm:px-4 sm:text-sm"
            >
              <Shuffle className="size-3.5" aria-hidden />
              Shuffle
            </button>
            <button
              type="button"
              onClick={playFavoritesInOrder}
              className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-[var(--jb-muted)] hover:text-white sm:min-h-10 sm:px-4 sm:text-sm"
            >
              Play all
            </button>
          </div>
        ) : null}
      </div>

      <ol className={cn("divide-y divide-white/[0.05] px-1 py-1 sm:px-2")}>
        {favoriteSongs.map((song, index) => (
          <li key={song.slug}>
            <SongRow
              song={song}
              index={index}
              showIndex
              compact
              showChevron={false}
              playlist={favoriteSongs}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
