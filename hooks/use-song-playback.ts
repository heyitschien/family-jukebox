"use client";

import { useCallback } from "react";

import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type UseSongPlaybackOptions = {
  /** When set, play advances through the full list unless this is a lone track. */
  playlist?: Song[];
  /** Force single-track playback even when a playlist is provided. */
  singleOnly?: boolean;
};

/** Shared play/pause state for any song button in the app */
export function useSongPlayback(song: Song, options: UseSongPlaybackOptions = {}) {
  const { playlist, singleOnly = false } = options;
  const { toggleSong, playQueue, isSongPlaying, currentSong } = usePlayer();

  const playInContext = useCallback(() => {
    if (!singleOnly && playlist && playlist.length > 1) {
      const idx = playlist.findIndex((s) => s.slug === song.slug);
      playQueue(playlist, idx >= 0 ? idx : 0);
      return;
    }
    toggleSong(song);
  }, [singleOnly, playlist, song, playQueue, toggleSong]);

  const toggle = useCallback(() => {
    if (currentSong?.slug === song.slug) {
      toggleSong(song);
      return;
    }
    playInContext();
  }, [currentSong?.slug, song, toggleSong, playInContext]);

  return {
    playing: isSongPlaying(song),
    isCurrent: currentSong?.slug === song.slug,
    toggle,
    playInContext,
  };
}
