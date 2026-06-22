"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { ArtistLink } from "@/components/artist-link";
import { CoverImage } from "@/components/cover-image";
import { FavoriteButton } from "@/components/favorite-button";
import { PlayIconButton } from "@/components/play-icon-button";
import { formatTime, usePlayer } from "@/contexts/player-context";
import type { RepeatMode, ShuffleMode } from "@/lib/player-queue";
import { cn } from "@/lib/utils";
import { getMemberBySlug } from "@/data/members";

export function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    skipNext,
    skipPrev,
    cycleRepeat,
    toggleShuffle,
    repeatMode,
    shuffleMode,
    currentTime,
    duration,
  } = usePlayer();

  if (!currentSong) return null;

  const author = getMemberBySlug(currentSong.authorSlug);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      className={cn(
        "fixed inset-x-2.5 z-50 overflow-hidden rounded-[20px] border border-white/10",
        "bg-[rgba(10,14,18,0.94)] shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-[22px]",
        "bottom-[calc(66px+env(safe-area-inset-bottom))] sm:inset-x-[18px] sm:bottom-[18px] sm:rounded-[24px] lg:bottom-[18px]",
      )}
    >
      <div
        className="family-progress h-[3px] origin-left transition-[width] duration-150 ease-linear"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Playback progress"
      />

      {/* Mobile — stacked, full transport row */}
      <div className="flex flex-col gap-3 px-3.5 pb-3.5 pt-3 sm:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/songs/${currentSong.slug}`} className="shrink-0">
            <CoverImage
              src={currentSong.coverSrc}
              alt=""
              className="size-11 shrink-0 rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/songs/${currentSong.slug}`} className="block truncate text-[15px] font-semibold leading-tight">
              {currentSong.title}
            </Link>
            <span className="mt-0.5 block truncate text-[13px] text-[var(--jb-muted)]">
              {author ? (
                <ArtistLink member={author} className="text-[var(--jb-muted)] hover:text-white" />
              ) : (
                "Family"
              )}
              {" · Cousin Radio"}
            </span>
          </div>
          <FavoriteButton slug={currentSong.slug} size="sm" />
          <div className="shrink-0 text-right text-[11px] tabular-nums text-[var(--jb-muted-2)]">
            <span>{formatTime(currentTime)}</span>
            <span className="mx-0.5 opacity-50">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <PlayerTransportControls
          isPlaying={isPlaying}
          shuffleMode={shuffleMode}
          repeatMode={repeatMode}
          playSize="md"
          onTogglePlay={togglePlay}
          onSkipPrev={skipPrev}
          onSkipNext={skipNext}
          onToggleShuffle={toggleShuffle}
          onCycleRepeat={cycleRepeat}
        />
      </div>

      {/* Desktop — three-column bar */}
      <div className="hidden min-h-[74px] grid-cols-[1fr_minmax(260px,560px)_1fr] items-center gap-4 px-4 py-3 sm:grid">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={`/songs/${currentSong.slug}`} className="shrink-0">
            <CoverImage src={currentSong.coverSrc} alt="" className="size-[54px] shrink-0 rounded-[14px]" />
          </Link>
          <div className="min-w-0">
            <Link href={`/songs/${currentSong.slug}`} className="block truncate text-sm font-semibold">
              {currentSong.title}
            </Link>
            <span className="text-[13px] text-[var(--jb-muted)]">
              {author ? (
                <ArtistLink member={author} className="text-[var(--jb-muted)] hover:text-white" />
              ) : (
                "Family"
              )}
              {" · Cousin Radio"}
            </span>
          </div>
          <FavoriteButton slug={currentSong.slug} size="sm" />
        </div>

        <div className="grid gap-2">
          <PlayerTransportControls
            isPlaying={isPlaying}
            shuffleMode={shuffleMode}
            repeatMode={repeatMode}
            playSize="md"
            onTogglePlay={togglePlay}
            onSkipPrev={skipPrev}
            onSkipNext={skipNext}
            onToggleShuffle={toggleShuffle}
            onCycleRepeat={cycleRepeat}
          />
          <div className="flex w-full items-center gap-2.5 text-[11px] text-[var(--jb-muted-2)]">
            <span>{formatTime(currentTime)}</span>
            <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/15">
              <div
                className="family-progress h-full transition-[width] duration-150 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden items-center justify-end gap-2.5 text-[var(--jb-muted)] sm:flex">
          <VolumeIcon />
          <div className="h-[5px] w-24 overflow-hidden rounded-full bg-white/15">
            <div className="family-progress h-full w-[70%]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

type PlayerTransportControlsProps = {
  isPlaying: boolean;
  shuffleMode: ShuffleMode;
  repeatMode: RepeatMode;
  playSize: "sm" | "md";
  onTogglePlay: () => void;
  onSkipPrev: () => void;
  onSkipNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
};

function PlayerTransportControls({
  isPlaying,
  shuffleMode,
  repeatMode,
  playSize,
  onTogglePlay,
  onSkipPrev,
  onSkipNext,
  onToggleShuffle,
  onCycleRepeat,
}: PlayerTransportControlsProps) {
  return (
    <div className="flex items-center justify-center gap-1 text-[var(--jb-muted)] sm:gap-3">
      <ModeButton
        active={shuffleMode === "on"}
        label={shuffleMode === "on" ? "Shuffle on" : "Shuffle off"}
        onClick={onToggleShuffle}
      >
        <ShuffleIcon active={shuffleMode === "on"} />
      </ModeButton>

      <TransportButton label="Previous" onClick={onSkipPrev}>
        <SkipPrevIcon />
      </TransportButton>

      <PlayIconButton
        size={playSize}
        variant="light"
        playing={isPlaying}
        label="Toggle playback"
        onClick={onTogglePlay}
        className="mx-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:mx-0"
      />

      <TransportButton label="Next" onClick={onSkipNext}>
        <SkipNextIcon />
      </TransportButton>

      <ModeButton
        active={repeatMode !== "off"}
        label={
          repeatMode === "one"
            ? "Repeat one song"
            : repeatMode === "all"
              ? "Repeat playlist"
              : "Repeat off"
        }
        onClick={onCycleRepeat}
        badge={repeatMode === "one" ? "1" : undefined}
      >
        <RepeatIcon />
      </ModeButton>
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
  badge,
  children,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active ? "true" : "false"}
      className={cn(
        "relative inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full transition-all duration-200",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation] active:scale-95",
        active
          ? "bg-family-soft text-family-glow shadow-[0_0_18px_rgba(255,111,177,0.22)] ring-1 ring-[rgba(255,111,177,0.35)]"
          : "text-[var(--jb-muted)] hover:bg-white/[0.06] hover:text-white",
      )}
    >
      {children}
      {badge ? (
        <span className="absolute right-1.5 top-1.5 text-[9px] font-bold leading-none text-family-glow">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function TransportButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex size-11 min-h-11 min-w-11 items-center justify-center rounded-full",
        "text-[var(--jb-muted)] transition-all duration-200",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation]",
        "hover:bg-white/[0.06] hover:text-white active:scale-95",
      )}
    >
      {children}
    </button>
  );
}

function ShuffleIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden>
      <path
        d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"
        opacity={active ? 1 : 0.85}
      />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden>
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
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
