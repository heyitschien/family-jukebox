"use client";

import { PlayButton } from "@/components/play-button";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumSongs, type Album } from "@/data/albums";

type AlbumPlayHeaderProps = {
  album: Album;
};

export function AlbumPlayHeader({ album }: AlbumPlayHeaderProps) {
  const { playQueue } = usePlayer();
  const songs = getAlbumSongs(album);

  if (songs.length === 0) return null;

  return (
    <PlayButton
      size="lg"
      label={`Play album`}
      onClick={() => playQueue(songs, 0)}
    />
  );
}
