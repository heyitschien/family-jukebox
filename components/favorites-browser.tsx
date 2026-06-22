"use client";

import { useMemo } from "react";

import { EmptyState } from "@/components/empty-state";
import { SongGrid } from "@/components/song-grid";
import { usePlayer } from "@/contexts/player-context";
import { members } from "@/data/members";
import { songs } from "@/data/songs";
import { useFavoriteSongs } from "@/hooks/use-favorite-songs";
import { buildSmartShuffledQueue } from "@/lib/smart-shuffle";

function getFavoriteFilters(favoriteSongs: typeof songs) {
  const memberSlugs = new Set(favoriteSongs.map((song) => song.authorSlug));
  const favoriteMembers = members.filter((member) => memberSlugs.has(member.slug));
  const favoriteAges = [...new Set(favoriteMembers.map((member) => member.age))].sort((a, b) => a - b);

  const favoriteTags = Array.from(
    new Set(favoriteSongs.flatMap((song) => song.tags)),
  ).sort((a, b) => a.localeCompare(b));

  return { favoriteMembers, favoriteAges, favoriteTags };
}

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
        description="Tap the heart on any song, then it appears here on this browser."
      />
    );
  }

  const { favoriteMembers, favoriteAges, favoriteTags } = getFavoriteFilters(favoriteSongs);
  const canPlayAll = favoriteSongs.length >= 2;

  const playFavoritesShuffled = () => {
    const shuffled = buildSmartShuffledQueue(favoriteSongs, 0);
    playQueue(shuffled, 0, "shelf");
  };

  const playFavoritesInOrder = () => {
    playQueue(favoriteSongs, 0, "shelf");
  };

  return (
    <section className="space-y-6">
      {canPlayAll ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={playFavoritesShuffled}
            className="inline-flex min-h-11 items-center rounded-full bg-family-accent px-5 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
          >
            Play favorites
          </button>
          <button
            type="button"
            onClick={playFavoritesInOrder}
            className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/10 px-5 py-2.5 text-sm font-bold [-webkit-tap-highlight-color:transparent]"
          >
            Play in order
          </button>
        </div>
      ) : null}

      <SongGrid
        songs={favoriteSongs}
        tags={favoriteTags}
        members={favoriteMembers}
        ages={favoriteAges}
        groupByAuthor={false}
      />
    </section>
  );
}
