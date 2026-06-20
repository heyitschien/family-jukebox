"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
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
          <button
            type="button"
            onClick={skipPrev}
            aria-label="Previous"
            className="inline-flex size-10 items-center justify-center [-webkit-tap-highlight-color:transparent]"
          >
            <SkipPrevIcon />
          </button>
          <PlayIconButton
            size="md"
            variant="light"
            playing={isPlaying}
            label="Toggle playback"
            onClick={togglePlay}
          />
          <button
            type="button"
            onClick={skipNext}
            aria-label="Next"
            className="inline-flex size-10 items-center justify-center [-webkit-tap-highlight-color:transparent]"
          >
            <SkipNextIcon />
          </button>
        </div>
        <div className="flex w-full items-center gap-2.5 text-[11px] text-[var(--jb-muted-2)]">
          <span>{formatTime(currentTime)}</span>
          <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="family-progress h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={skipNext}
          aria-label="Next"
          className="inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[var(--jb-text)] [-webkit-tap-highlight-color:transparent] sm:hidden"
        >
          <SkipNextIcon />
        </button>
        <PlayIconButton
          size="sm"
          variant="light"
          playing={isPlaying}
          label="Toggle playback"
          onClick={togglePlay}
          className="sm:hidden"
        />
        <div className="hidden items-center gap-2.5 text-[var(--jb-muted)] sm:flex">
          <VolumeIcon />
          <div className="h-[5px] w-24 overflow-hidden rounded-full bg-white/15">
            <div className="family-progress h-full w-[70%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SkipPrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
      <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function SkipNextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
      <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}
