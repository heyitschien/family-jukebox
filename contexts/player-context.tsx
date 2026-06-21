"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Song } from "@/data/songs";
import { trackPlayEvent } from "@/lib/analytics/track-play";

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playSong: (song: Song) => void;
  toggleSong: (song: Song) => void;
  isSongPlaying: (song: Song) => boolean;
  playQueue: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  pause: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  queue: Song[];
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function songSrcMatches(audio: HTMLAudioElement, audioSrc: string): boolean {
  if (!audio.src) return false;
  try {
    const pathname = new URL(audio.src, window.location.origin).pathname;
    return pathname === audioSrc || pathname.endsWith(audioSrc);
  } catch {
    return audio.src.endsWith(audioSrc);
  }
}

export { formatTime };

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const currentSongRef = useRef<Song | null>(null);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  // Mobile browsers require play() inside the tap handler — not in useEffect.
  const startPlayback = useCallback((song: Song, nextQueue: Song[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    queueRef.current = nextQueue;
    setQueue(nextQueue);
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(0);

    if (!songSrcMatches(audio, song.audioSrc)) {
      audio.src = song.audioSrc;
    }

    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        trackPlayEvent({ songSlug: song.slug, event: "start", source: "unknown" });
      })
      .catch(() => setIsPlaying(false));
  }, []);

  const playSong = useCallback(
    (song: Song) => {
      startPlayback(song, [song]);
    },
    [startPlayback],
  );

  const isSongPlaying = useCallback(
    (song: Song) => currentSong?.slug === song.slug && isPlaying,
    [currentSong, isPlaying],
  );

  const toggleSong = useCallback(
    (song: Song) => {
      const audio = audioRef.current;
      if (!audio) return;

      const isSameSong = currentSong?.slug === song.slug;

      if (isSameSong) {
        if (audio.paused) {
          void audio
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      startPlayback(song, [song]);
    },
    [currentSong, startPlayback],
  );

  const playQueue = useCallback(
    (songs: Song[], startIndex = 0) => {
      if (songs.length === 0) return;
      const index = Math.min(startIndex, songs.length - 1);
      const song = songs[index];
      if (song) startPlayback(song, songs);
    },
    [startPlayback],
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.paused) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentSong]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    audio?.pause();
    setIsPlaying(false);
  }, []);

  const skipNext = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    const idx = q.findIndex((s) => s.slug === currentSong?.slug);
    const next = q[idx + 1] ?? q[0];
    if (next) startPlayback(next, q);
  }, [currentSong, startPlayback]);

  const skipPrev = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;
    const idx = q.findIndex((s) => s.slug === currentSong?.slug);
    const prev = q[idx - 1] ?? q[q.length - 1];
    if (prev) startPlayback(prev, q);
  }, [currentSong, startPlayback]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const song = currentSongRef.current;
      if (song) {
        trackPlayEvent({
          songSlug: song.slug,
          event: "complete",
          source: "auto-advance",
          durationMs: Math.round(audio.currentTime * 1000),
        });
      }

      const q = queueRef.current;
      if (q.length <= 1) {
        setIsPlaying(false);
        return;
      }
      const idx = q.findIndex((s) => s.slug === currentSong?.slug);
      const next = q[idx + 1];
      if (next) {
        startPlayback(next, q);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSong?.slug, startPlayback]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playSong,
        toggleSong,
        isSongPlaying,
        playQueue,
        togglePlay,
        pause,
        skipNext,
        skipPrev,
        queue,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        className="pointer-events-none fixed h-0 w-0 opacity-0"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
