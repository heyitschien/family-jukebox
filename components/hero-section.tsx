"use client";

import { useCallback } from "react";

import { CoverImage } from "@/components/cover-image";
import { formatTime, usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { getMemberBySlug } from "@/data/members";
import { getSpotlightAuthorNames } from "@/lib/featured-rotation";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";

type HeroSectionProps = {
  featured: Song;
  playlist: Song[];
  familyQueue: Song[];
};

export function HeroSection({ featured, playlist, familyQueue }: HeroSectionProps) {
  const { playQueue, currentSong, isPlaying, togglePlay, currentTime, duration } = usePlayer();
  const liveSong = currentSong;
  const heroSong = liveSong ?? featured;
  const isLive = Boolean(liveSong);
  const { playInContext: playSingle } = useSongPlayback(heroSong, { singleOnly: true });
  const author = getMemberBySlug(heroSong.authorSlug);
  const spotlightNames = getSpotlightAuthorNames();
  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const playFeaturedPlaylist = useCallback(() => {
    const idx = playlist.findIndex((song) => song.slug === featured.slug);
    playQueue(playlist, idx >= 0 ? idx : 0);
  }, [featured.slug, playQueue, playlist]);

  const handleHeroPlay = useCallback(() => {
    if (isLive) {
      togglePlay();
      return;
    }
    playFeaturedPlaylist();
  }, [isLive, playFeaturedPlaylist, togglePlay]);

  return (
    <section className="relative -mx-3 flex min-h-[430px] items-end overflow-hidden rounded-b-[34px] border border-white/[0.08] bg-[#0a1218] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:min-h-[360px] sm:rounded-[32px] sm:p-[34px] lg:min-h-[360px]">
      <CoverImage src={heroSong.coverSrc} alt={`${heroSong.title} artwork`} className="absolute inset-0 size-full" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(92deg,rgba(5,8,11,0.97)_0%,rgba(5,8,11,0.8)_43%,rgba(5,8,11,0.2)_100%)]"
      />
      <div className="relative z-10 max-w-3xl">
        <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
          {isLive ? "🎧 Live now playing" : "✨ Today&apos;s spotlight"} · {author?.name ?? "Family"}
        </span>
        <h1 className="text-[clamp(48px,12vw,92px)] leading-[0.88] font-extrabold tracking-[-0.075em]">
          Family Jukebox
        </h1>
        <p className="mt-4 max-w-[590px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
          A clean, joyful home for every family song. Tap play anywhere and this spotlight updates
          instantly with what&apos;s on right now.
        </p>
        {isLive ? (
          <div className="mt-3 max-w-[360px] rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-sm font-bold text-[var(--family-pink)]">{heroSong.title}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-[var(--jb-muted)]">
              <span>{formatTime(currentTime)}</span>
              <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/15">
                <div className="family-progress h-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm font-bold text-[var(--family-ocean)]">
              Rotating spotlight: {spotlightNames}
            </p>
            <p className="mt-1 text-sm font-bold text-[var(--family-pink)]">{featured.title}</p>
          </>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <PlayIconButton
            size="xl"
            playing={isLive && isPlaying}
            label={isLive ? "Toggle now playing" : "Play featured playlist"}
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
            onClick={playSingle}
            className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] [-webkit-tap-highlight-color:transparent] hover:text-white"
          >
            Play only this track
          </button>
        </div>
      </div>
    </section>
  );
}
