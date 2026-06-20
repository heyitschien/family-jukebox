"use client";

import Link from "next/link";
import { Pause, Play } from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleMainPlay}
        className="grid size-14 place-items-center rounded-full bg-family-accent text-xl text-[#1a0812] shadow-family"
        aria-label={isCurrent && isPlaying ? "Pause" : "Play"}
      >
        {isCurrent && isPlaying ? (
          <Pause className="size-6 fill-current" />
        ) : (
          <Play className="size-6 fill-current ml-0.5" />
        )}
      </button>
      <button
        type="button"
        onClick={() => playQueue(queue, queue.findIndex((s) => s.slug === song.slug))}
        className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black"
      >
        Play artist mix
      </button>
      <Link
        href={`/members/${song.authorSlug}`}
        className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#050608]"
      >
        View artist
      </Link>
    </div>
  );
}
