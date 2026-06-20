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

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playSong: (song: Song) => void;
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

export { formatTime };

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playSong = useCallback((song: Song) => {
    setQueue([song]);
    setCurrentSong(song);
    setIsPlaying(true);
  }, []);

  const playQueue = useCallback((songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    const index = Math.min(startIndex, songs.length - 1);
    setQueue(songs);
    setCurrentSong(songs[index] ?? null);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  }, [currentSong]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const skipNext = useCallback(() => {
    if (queue.length === 0) return;
    const idx = queue.findIndex((s) => s.slug === currentSong?.slug);
    const next = queue[idx + 1] ?? queue[0];
    if (next) {
      setCurrentSong(next);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  const skipPrev = useCallback(() => {
    if (queue.length === 0) return;
    const idx = queue.findIndex((s) => s.slug === currentSong?.slug);
    const prev = queue[idx - 1] ?? queue[queue.length - 1];
    if (prev) {
      setCurrentSong(prev);
      setIsPlaying(true);
    }
  }, [currentSong, queue]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    const src = currentSong.audioSrc;
    if (!audio.src.endsWith(src)) {
      audio.src = src;
      audio.load();
    }

    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (queue.length <= 1) {
        setIsPlaying(false);
        return;
      }
      skipNext();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [queue.length, skipNext]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong?.slug]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        playSong,
        playQueue,
        togglePlay,
        pause,
        skipNext,
        skipPrev,
        queue,
      }}
    >
      {children}
      <audio ref={audioRef} preload="metadata" className="hidden" />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
