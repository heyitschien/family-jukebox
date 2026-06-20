"use client";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

/** Shared play/pause state for any song button in the app */
export function useSongPlayback(song: Song, queue?: Song[]) {
  const { toggleSong, isSongPlaying, currentSong, playQueue } = usePlayer();

  const toggle = () => {
    const isCurrent = currentSong?.slug === song.slug;
    if (isCurrent || !queue || queue.length <= 1) {
      toggleSong(song);
      return;
    }

    const startIndex = queue.findIndex((queuedSong) => queuedSong.slug === song.slug);
    playQueue(queue, startIndex >= 0 ? startIndex : 0);
  };

  return {
    playing: isSongPlaying(song),
    isCurrent: currentSong?.slug === song.slug,
    toggle,
  };
}
