"use client";

import { useCallback } from "react";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import type { PlaySource } from "@/lib/analytics/constants";
import type { QueueContext } from "@/lib/queue-context";

type UseSongPlaybackOptions = {
  /** When set, play advances through the full list unless this is a lone track. */
  playlist?: Song[];
  /** Force single-track playback even when a playlist is provided. */
  singleOnly?: boolean;
  /** Analytics source for play-start events. */
  source?: PlaySource;
  /** Where the queue came from — shown in the mini player and now-playing view. */
  queueContext?: QueueContext;
};

/** Shared play/pause state for any song button in the app */
export function useSongPlayback(song: Song, options: UseSongPlaybackOptions = {}) {
  const { playlist, singleOnly = false, source = "unknown", queueContext } = options;
  const { toggleSong, playQueue, isSongPlaying, currentSong } = usePlayer();

  const playInContext = useCallback(() => {
    if (!singleOnly && playlist && playlist.length > 1) {
      const idx = playlist.findIndex((s) => s.slug === song.slug);
      playQueue(playlist, idx >= 0 ? idx : 0, source, queueContext);
      return;
    }
    toggleSong(song, source, queueContext);
  }, [singleOnly, playlist, song, playQueue, toggleSong, source, queueContext]);

  const toggle = useCallback(() => {
    if (currentSong?.slug === song.slug) {
      toggleSong(song, source);
      return;
    }
    playInContext();
  }, [currentSong?.slug, song, toggleSong, playInContext, source]);

  return {
    playing: isSongPlaying(song),
    isCurrent: currentSong?.slug === song.slug,
    toggle,
    playInContext,
  };
}
