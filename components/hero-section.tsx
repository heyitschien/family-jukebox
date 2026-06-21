"use client";

import Link from "next/link";
import { useCallback } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { formatTime, usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { getMemberBySlug } from "@/data/members";
import { getSpotlightAuthorNames } from "@/lib/featured-rotation";
import { useSongPlayback } from "@/hooks/use-song-playback";

type HeroSectionProps = {
  featured: Song;
  playlist: Song[];
  familyQueue: Song[];
};

export function HeroSection({ featured, playlist, familyQueue }: HeroSectionProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    queue,
    playQueue,
    togglePlay,
    skipNext,
    skipPrev,
  } = usePlayer();
  const { playing, toggle } = useSongPlayback(featured, { playlist });
  const { playInContext: playSingle } = useSongPlayback(featured, { singleOnly: true });
  const activeSong = currentSong ?? featured;
  const activeAuthor = getMemberBySlug(activeSong.authorSlug);
  const spotlightNames = getSpotlightAuthorNames();
  const hasLiveSong = currentSong !== null;
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const canSkip = queue.length > 1;

  const playFeaturedPlaylist = useCallback(() => {
    const idx = playlist.findIndex((song) => song.slug === featured.slug);
    playQueue(playlist, idx >= 0 ? idx : 0);
  }, [featured.slug, playQueue, playlist]);

  const playActiveSongOnly = useCallback(() => {
    playQueue([activeSong], 0);
  }, [activeSong, playQueue]);

  const handleHeroPlay = useCallback(() => {
    if (hasLiveSong) {
      togglePlay();
      return;
    }
    if (playing) {
      toggle();
      return;
    }
    playFeaturedPlaylist();
  }, [hasLiveSong, playing, toggle, togglePlay, playFeaturedPlaylist]);

  return (
    <section className="relative isolate -mx-3 flex min-h-[520px] items-end overflow-hidden rounded-b-[34px] border border-white/[0.08] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:min-h-[420px] sm:rounded-[32px] sm:p-[34px] lg:min-h-[420px]">
      <CoverImage
        src={activeSong.coverSrc}
        alt=""
        className="absolute inset-0 -z-30 size-full"
        sizes="(min-width: 1024px) calc(100vw - 296px), 100vw"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(7,12,16,0.97)_0%,rgba(7,12,16,0.82)_45%,rgba(7,12,16,0.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[linear-gradient(0deg,rgba(7,12,16,0.98)_0%,rgba(7,12,16,0.68)_56%,rgba(7,12,16,0)_100%)]" />

      <div className="relative z-10 grid w-full gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-end">
        <div className="max-w-3xl">
          <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
            {hasLiveSong ? "Live player" : "Today's spotlight"} · {activeAuthor?.name ?? "Family"}
          </span>
          <h1 className="text-[clamp(48px,12vw,92px)] leading-[0.88] font-extrabold tracking-[-0.075em]">
            Family Jukebox
          </h1>
          <p className="mt-4 max-w-[590px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
            A clean home for the songs, videos, and stories we make together. Tap any track and this
            spotlight turns into a live player for the family mix.
          </p>
          <p className="mt-2 text-sm font-bold text-[var(--family-ocean)]">
            {hasLiveSong ? "Now featuring" : "Spotlight rotation"}:{" "}
            {hasLiveSong ? activeSong.title : spotlightNames}
          </p>
          {!hasLiveSong ? (
            <p className="mt-1 text-sm font-bold text-[var(--family-pink)]">{featured.title}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PlayIconButton
              size="xl"
              playing={hasLiveSong ? isPlaying : playing}
              label={hasLiveSong ? "Toggle live player" : "Play featured playlist"}
              onClick={handleHeroPlay}
            />
            <button
              type="button"
              onClick={() => playQueue(familyQueue, 0)}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608] [-webkit-tap-highlight-color:transparent]"
            >
              Play family mix
            </button>
            <button
              type="button"
              onClick={hasLiveSong ? playActiveSongOnly : playSingle}
              className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] [-webkit-tap-highlight-color:transparent] hover:text-white"
            >
              Play this song only
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/[0.12] bg-[rgba(11,15,20,0.68)] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-[20px]">
          <div className="grid grid-cols-[78px_1fr_auto] items-center gap-3">
            <Link href={`/songs/${activeSong.slug}`} className="overflow-hidden rounded-[20px]">
              <CoverImage src={activeSong.coverSrc} alt="" className="aspect-square w-full" />
            </Link>
            <Link href={`/songs/${activeSong.slug}`} className="min-w-0">
              <span className="text-[11px] font-black tracking-[0.18em] text-[var(--family-ocean)] uppercase">
                {hasLiveSong ? (isPlaying ? "Now playing" : "Paused") : "Featured song"}
              </span>
              <h2 className="mt-1 truncate text-lg font-black tracking-tight">{activeSong.title}</h2>
              <p className="mt-1 line-clamp-2 text-xs leading-snug text-[var(--jb-muted)]">
                {activeSong.subtitle ?? `${activeAuthor?.name ?? "Family"} original`}
              </p>
            </Link>
            <PlayIconButton
              size="sm"
              variant="light"
              playing={hasLiveSong ? isPlaying : playing}
              label={hasLiveSong ? `Play ${activeSong.title}` : `Play ${featured.title}`}
              onClick={handleHeroPlay}
            />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={skipPrev}
              disabled={!canSkip}
              aria-label="Previous song"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-[var(--jb-muted)] disabled:opacity-35 [-webkit-tap-highlight-color:transparent]"
            >
              <SkipPrevIcon />
            </button>
            <div className="min-w-0 flex-1">
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div className="family-progress h-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] font-bold text-[var(--jb-muted-2)]">
                <span>{hasLiveSong ? formatTime(currentTime) : "0:00"}</span>
                <span>{hasLiveSong ? formatTime(duration) : "Ready"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={skipNext}
              disabled={!canSkip}
              aria-label="Next song"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-[var(--jb-muted)] disabled:opacity-35 [-webkit-tap-highlight-color:transparent]"
            >
              <SkipNextIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
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
