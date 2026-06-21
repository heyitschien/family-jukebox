import type { Song } from "@/data/songs";

export type RepeatMode = "off" | "one" | "all";
export type ShuffleMode = "off" | "on";

export function cycleRepeatMode(current: RepeatMode): RepeatMode {
  switch (current) {
    case "off":
      return "all";
    case "all":
      return "one";
    case "one":
      return "off";
    default: {
      const _exhaustive: never = current;
      return _exhaustive;
    }
  }
}

export function toggleShuffleMode(current: ShuffleMode): ShuffleMode {
  return current === "off" ? "on" : "off";
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Build playback order when shuffle is on — start song stays first. */
export function buildShuffledQueue(songs: Song[], startIndex: number): Song[] {
  if (songs.length <= 1) return [...songs];
  const clamped = Math.min(Math.max(startIndex, 0), songs.length - 1);
  const startSong = songs[clamped];
  const rest = songs.filter((_, i) => i !== clamped);
  shuffleInPlace(rest);
  return [startSong, ...rest];
}

/** Reshuffle remaining tracks while keeping the current song at the front. */
export function reshuffleFromCurrent(original: Song[], currentSlug: string): Song[] {
  if (original.length <= 1) return [...original];
  const currentIdx = original.findIndex((s) => s.slug === currentSlug);
  if (currentIdx < 0) return [...original];
  const current = original[currentIdx];
  const remaining = [...original.slice(0, currentIdx), ...original.slice(currentIdx + 1)];
  shuffleInPlace(remaining);
  return [current, ...remaining];
}

export function resolveQueueForPlayback(
  songs: Song[],
  startIndex: number,
  shuffleMode: ShuffleMode,
): { queue: Song[]; index: number } {
  if (songs.length === 0) return { queue: [], index: 0 };
  if (shuffleMode === "on") {
    const queue = buildShuffledQueue(songs, startIndex);
    return { queue, index: 0 };
  }
  const index = Math.min(Math.max(startIndex, 0), songs.length - 1);
  return { queue: [...songs], index };
}

export type AdvanceDirection = "next" | "prev";

export type ResolveTrackOptions = {
  queue: Song[];
  currentIndex: number;
  repeatMode: RepeatMode;
  direction: AdvanceDirection;
  /** Manual skip/advance (vs natural end-of-track). */
  manual: boolean;
};

export type TrackAdvanceResult =
  | { action: "play"; index: number }
  | { action: "repeat"; index: number }
  | { action: "stop" };

/** Decide what happens after a track ends or the user skips. */
export function resolveTrackAdvance({
  queue,
  currentIndex,
  repeatMode,
  direction,
  manual,
}: ResolveTrackOptions): TrackAdvanceResult {
  if (queue.length === 0) return { action: "stop" };

  const safeIndex =
    currentIndex >= 0 && currentIndex < queue.length ? currentIndex : 0;

  if (!manual && repeatMode === "one") {
    return { action: "repeat", index: safeIndex };
  }

  if (direction === "next") {
    const nextIndex = safeIndex + 1;
    if (nextIndex < queue.length) {
      return { action: "play", index: nextIndex };
    }
    if (repeatMode === "all") {
      return { action: "play", index: 0 };
    }
    return { action: "stop" };
  }

  const prevIndex = safeIndex - 1;
  if (prevIndex >= 0) {
    return { action: "play", index: prevIndex };
  }
  if (repeatMode === "all") {
    return { action: "play", index: queue.length - 1 };
  }
  return { action: "repeat", index: safeIndex };
}
