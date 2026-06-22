"use client";

import { useMemo } from "react";

import { EmptyState } from "@/components/empty-state";
import { SongGrid } from "@/components/song-grid";
import { members } from "@/data/members";
import { songs } from "@/data/songs";
import { useFavoriteSongs } from "@/hooks/use-favorite-songs";

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

  return (
    <SongGrid
      songs={favoriteSongs}
      tags={favoriteTags}
      members={favoriteMembers}
      ages={favoriteAges}
      groupByAuthor={false}
    />
  );
}
