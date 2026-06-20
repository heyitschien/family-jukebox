"use client";

import Link from "next/link";

import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type SongDetailActionsProps = {
  song: Song;
  queue: Song[];
};

export function SongDetailActions({ song, queue }: SongDetailActionsProps) {
  const { playSong, playQueue, currentSong, isPlaying, togglePlay } = usePlayer();
  const isCurrent = currentSong?.slug === song.slug;

  const handleMainPlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <PlayIconButton
        size="lg"
        playing={isCurrent && isPlaying}
        label={isCurrent && isPlaying ? "Pause" : `Play ${song.title}`}
        onClick={handleMainPlay}
      />
      <button
        type="button"
        onClick={() => playQueue(queue, queue.findIndex((s) => s.slug === song.slug))}
        className="inline-flex min-h-11 items-center rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black [-webkit-tap-highlight-color:transparent]"
      >
        Play artist mix
      </button>
      <Link
        href={`/members/${song.authorSlug}`}
        className="inline-flex min-h-11 items-center rounded-full bg-white px-5 py-3 text-sm font-black text-[#050608]"
      >
        View artist
      </Link>
    </div>
  );
}
