"use client";

import { PlayButton } from "@/components/play-button";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type AlbumPlayHeaderProps = {
  songs: Song[];
  albumTitle: string;
};

export function AlbumPlayHeader({ songs, albumTitle }: AlbumPlayHeaderProps) {
  const { playQueue } = usePlayer();

  if (songs.length === 0) return null;

  return <PlayButton size="lg" label={`Play ${albumTitle}`} onClick={() => playQueue(songs, 0)} />;
}
