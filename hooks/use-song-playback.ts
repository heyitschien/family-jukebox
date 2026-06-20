"use client";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type SongPlaybackOptions = {
  queue?: Song[];
};

/** Shared play/pause state for any song button in the app */
export function useSongPlayback(song: Song, options?: SongPlaybackOptions) {
  const { toggleSong, isSongPlaying, currentSong } = usePlayer();

  return {
    playing: isSongPlaying(song),
    isCurrent: currentSong?.slug === song.slug,
    toggle: () => toggleSong(song, options?.queue),
  };
}
