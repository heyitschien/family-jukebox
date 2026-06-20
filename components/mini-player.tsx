"use client";

import Link from "next/link";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { formatTime, usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    skipNext,
    skipPrev,
    currentTime,
    duration,
  } = usePlayer();

  if (!currentSong) return null;

  const author = getMemberBySlug(currentSong.authorSlug);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside className="fixed inset-x-2.5 bottom-[calc(66px+env(safe-area-inset-bottom))] z-50 grid min-h-[66px] grid-cols-[1fr_auto] items-center gap-3 rounded-[22px] border border-white/10 bg-[rgba(10,14,18,0.92)] px-3 py-2.5 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-[22px] sm:inset-x-[18px] sm:bottom-[18px] sm:min-h-[74px] sm:grid-cols-[1fr_minmax(260px,560px)_1fr] sm:gap-4 sm:rounded-[24px] sm:px-4 sm:py-3 lg:bottom-[18px]">
      <Link href={`/songs/${currentSong.slug}`} className="flex min-w-0 items-center gap-3">
        <CoverImage src={currentSong.coverSrc} alt="" className="size-12 shrink-0 rounded-[14px] sm:size-[54px]" />
        <div className="min-w-0">
          <strong className="block truncate text-sm">{currentSong.title}</strong>
          <span className="text-[13px] text-[var(--jb-muted)]">
            {author?.name ?? "Family"} · Cousin Radio
          </span>
        </div>
      </Link>

      <div className="hidden justify-center sm:grid sm:gap-2">
        <div className="flex items-center justify-center gap-4 text-[var(--jb-muted)]">
          <button type="button" onClick={skipPrev} aria-label="Previous" className="hover:text-white">
            <SkipBack className="size-5" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="grid size-[38px] place-items-center rounded-full bg-[var(--jb-text)] text-[#050608]"
          >
            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
          </button>
          <button type="button" onClick={skipNext} aria-label="Next" className="hover:text-white">
            <SkipForward className="size-5" />
          </button>
        </div>
        <div className="flex w-full items-center gap-2.5 text-[11px] text-[var(--jb-muted-2)]">
          <span>{formatTime(currentTime)}</span>
          <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-[var(--jb-green)] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid size-10 place-items-center rounded-full bg-[var(--jb-text)] text-[#050608] sm:hidden"
        >
          {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
        </button>
        <div className="hidden items-center gap-2.5 text-[var(--jb-muted)] sm:flex">
          <Volume2 className="size-4" />
          <div className="h-[5px] w-24 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-[70%] bg-[var(--jb-green)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
