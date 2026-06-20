"use client";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type UseSongPlaybackOptions = {
  queue?: Song[];
  startIndex?: number;
};

/** Shared play/pause state for any song button in the app */
export function useSongPlayback(song: Song, options: UseSongPlaybackOptions = {}) {
  const { toggleSong, isSongPlaying, currentSong, playQueue, queue: activeQueue } = usePlayer();
  const { queue, startIndex } = options;
  const queueIndex =
    startIndex ?? Math.max(queue?.findIndex((queuedSong) => queuedSong.slug === song.slug) ?? -1, 0);
  const hasMatchingQueue =
    queue !== undefined &&
    activeQueue.length === queue.length &&
    activeQueue.every((queuedSong, index) => queuedSong.slug === queue[index]?.slug);

  return {
    playing: isSongPlaying(song),
    isCurrent: currentSong?.slug === song.slug,
    toggle: () => {
      if (queue && queue.length > 0 && currentSong?.slug === song.slug && !hasMatchingQueue) {
        playQueue(queue, queueIndex);
        return;
      }

      if (currentSong?.slug === song.slug) {
        toggleSong(song);
        return;
      }

      if (queue && queue.length > 0) {
        playQueue(queue, queueIndex);
        return;
      }

      toggleSong(song);
    },
  };
}
