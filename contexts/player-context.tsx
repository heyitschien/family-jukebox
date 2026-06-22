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
import type { PlaySource } from "@/lib/analytics/constants";
import { trackPlayEvent } from "@/lib/analytics/track-play";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import { buildRadioContinuation, shouldContinueRadio } from "@/lib/cousin-radio";
import { recordSessionPlay } from "@/lib/session-listening";
import {
  cycleRepeatMode,
  reshuffleFromCurrent,
  resolveQueueForPlayback,
  resolveTrackAdvance,
  toggleRadioMode,
  toggleShuffleMode,
  type RadioMode,
  type RepeatMode,
  type ShuffleMode,
} from "@/lib/player-queue";

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  shuffleMode: ShuffleMode;
  radioMode: RadioMode;
  playSong: (song: Song, source?: PlaySource) => void;
  toggleSong: (song: Song, source?: PlaySource) => void;
  isSongPlaying: (song: Song) => boolean;
  playQueue: (songs: Song[], startIndex?: number, source?: PlaySource) => void;
  togglePlay: () => void;
  pause: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  cycleRepeat: () => void;
  toggleShuffle: () => void;
  toggleRadio: () => void;
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
  const { listenerAge } = useListenerAgeContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Song[]>([]);
  const originalQueueRef = useRef<Song[]>([]);
  const currentIndexRef = useRef(0);
  const repeatModeRef = useRef<RepeatMode>("off");
  const shuffleModeRef = useRef<ShuffleMode>("off");
  const radioModeRef = useRef<RadioMode>("off");
  const playSourceRef = useRef<PlaySource>("unknown");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [shuffleMode, setShuffleMode] = useState<ShuffleMode>("off");
  const [radioMode, setRadioMode] = useState<RadioMode>("off");
  const currentSongRef = useRef<Song | null>(null);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    shuffleModeRef.current = shuffleMode;
  }, [shuffleMode]);

  useEffect(() => {
    radioModeRef.current = radioMode;
  }, [radioMode]);

  const restartCurrentTrack = useCallback((audio: HTMLAudioElement) => {
    audio.currentTime = 0;
    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, []);

  // Mobile browsers require play() inside the tap handler — not in useEffect.
  const startPlayback = useCallback(
    (song: Song, nextQueue: Song[], index: number, source: PlaySource = "unknown") => {
      const audio = audioRef.current;
      if (!audio) return;

      playSourceRef.current = source;

      const safeIndex =
        index >= 0 && index < nextQueue.length
          ? index
          : nextQueue.findIndex((s) => s.slug === song.slug);

      queueRef.current = nextQueue;
      currentIndexRef.current = safeIndex >= 0 ? safeIndex : 0;
      setQueue(nextQueue);
      setCurrentSong(song);
      setCurrentTime(0);
      setDuration(0);

      recordSessionPlay(song.slug);

      const sameSource = songSrcMatches(audio, song.audioSrc);
      if (!sameSource) {
        audio.src = song.audioSrc;
      } else {
        audio.currentTime = 0;
      }

      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
          trackPlayEvent({ songSlug: song.slug, event: "start", source });
        })
        .catch(() => setIsPlaying(false));
    },
    [],
  );

  const continueRadioFrom = useCallback(
    (seed: Song) => {
      const continuation = buildRadioContinuation(seed, { listenerAge });
      if (continuation.length === 0) {
        setIsPlaying(false);
        return;
      }

      originalQueueRef.current = continuation;
      const { queue: nextQueue, index } = resolveQueueForPlayback(
        continuation,
        0,
        shuffleModeRef.current,
      );
      const track = nextQueue[index];
      if (track) startPlayback(track, nextQueue, index, "auto-advance");
    },
    [listenerAge, startPlayback],
  );

  const advanceTrack = useCallback(
    (direction: "next" | "prev", manual: boolean) => {
      const q = queueRef.current;
      if (q.length === 0) return;

      const result = resolveTrackAdvance({
        queue: q,
        currentIndex: currentIndexRef.current,
        repeatMode: repeatModeRef.current,
        direction,
        manual,
      });

      if (result.action === "stop") {
        const seed = q[currentIndexRef.current] ?? currentSongRef.current;
        if (
          seed &&
          shouldContinueRadio(radioModeRef.current, repeatModeRef.current, manual)
        ) {
          continueRadioFrom(seed);
          return;
        }
        setIsPlaying(false);
        return;
      }

      const song = q[result.index];
      if (!song) {
        setIsPlaying(false);
        return;
      }

      if (result.action === "repeat") {
        const audio = audioRef.current;
        if (!audio) return;
        restartCurrentTrack(audio);
        return;
      }

      startPlayback(song, q, result.index, manual ? playSourceRef.current : "auto-advance");
    },
    [restartCurrentTrack, startPlayback, continueRadioFrom],
  );

  const playSong = useCallback(
    (song: Song, source: PlaySource = "unknown") => {
      originalQueueRef.current = [song];
      const { queue: nextQueue, index } = resolveQueueForPlayback(
        [song],
        0,
        shuffleModeRef.current,
      );
      const track = nextQueue[index];
      if (track) startPlayback(track, nextQueue, index, source);
    },
    [startPlayback],
  );

  const isSongPlaying = useCallback(
    (song: Song) => currentSong?.slug === song.slug && isPlaying,
    [currentSong, isPlaying],
  );

  const toggleSong = useCallback(
    (song: Song, source: PlaySource = "unknown") => {
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

      playSong(song, source);
    },
    [currentSong, playSong],
  );

  const playQueue = useCallback(
    (songs: Song[], startIndex = 0, source: PlaySource = "unknown") => {
      if (songs.length === 0) return;
      originalQueueRef.current = [...songs];
      const { queue: nextQueue, index } = resolveQueueForPlayback(
        songs,
        startIndex,
        shuffleModeRef.current,
      );
      const track = nextQueue[index];
      if (track) startPlayback(track, nextQueue, index, source);
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
    advanceTrack("next", true);
  }, [advanceTrack]);

  const skipPrev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      restartCurrentTrack(audio);
      return;
    }
    advanceTrack("prev", true);
  }, [advanceTrack, restartCurrentTrack]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((mode) => cycleRepeatMode(mode));
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffleMode((mode) => {
      const next = toggleShuffleMode(mode);
      const currentSlug = currentSongRef.current?.slug;
      const original = originalQueueRef.current;

      if (next === "on" && currentSlug && original.length > 1) {
        const shuffled = reshuffleFromCurrent(original, currentSlug);
        queueRef.current = shuffled;
        currentIndexRef.current = 0;
        setQueue(shuffled);
      } else if (next === "off" && currentSlug && original.length > 0) {
        const index = original.findIndex((s) => s.slug === currentSlug);
        queueRef.current = [...original];
        currentIndexRef.current = index >= 0 ? index : 0;
        setQueue([...original]);
      }

      return next;
    });
  }, []);

  const toggleRadio = useCallback(() => {
    setRadioMode((mode) => toggleRadioMode(mode));
  }, []);

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
          durationMs: Math.round(audio.duration * 1000) || Math.round(audio.currentTime * 1000),
        });
      }

      advanceTrack("next", false);
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
  }, [advanceTrack]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        repeatMode,
        shuffleMode,
        radioMode,
        playSong,
        toggleSong,
        isSongPlaying,
        playQueue,
        togglePlay,
        pause,
        skipNext,
        skipPrev,
        cycleRepeat,
        toggleShuffle,
        toggleRadio,
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
