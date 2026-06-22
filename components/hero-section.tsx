"use client";

import { useCallback } from "react";

import { formatTime, usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { getMemberBySlug } from "@/data/members";
import { BRAND_NAME } from "@/lib/brand";
import { getSpotlightAuthorNames } from "@/lib/featured-rotation";
import { PlayIconButton } from "@/components/play-icon-button";
import { Topbar } from "@/components/topbar";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  featured: Song;
  playlist: Song[];
  familyQueue: Song[];
};

function StatusDot({ playing }: { playing: boolean }) {
  return (
    <span
      className={cn(
        "inline-block size-2 rounded-full",
        playing ? "bg-[var(--family-pink)] shadow-[0_0_10px_rgba(255,111,177,0.8)]" : "bg-white/70",
      )}
      aria-hidden
    />
  );
}

export function HeroSection({ featured, playlist, familyQueue }: HeroSectionProps) {
  const { playQueue, currentSong, isPlaying, currentTime, duration, togglePlay } = usePlayer();
  const isLive = currentSong !== null;
  const displaySong = currentSong ?? featured;
  const displayAuthor = getMemberBySlug(displaySong.authorSlug);
  const spotlightNames = getSpotlightAuthorNames();

  const { playing, toggle } = useSongPlayback(displaySong, {
    playlist: isLive && currentSong ? undefined : playlist,
    singleOnly: isLive,
  });
  const { playInContext: playSingle } = useSongPlayback(featured, { singleOnly: true });

  const playFeaturedPlaylist = useCallback(() => {
    const idx = playlist.findIndex((song) => song.slug === featured.slug);
    playQueue(playlist, idx >= 0 ? idx : 0);
  }, [featured.slug, playQueue, playlist]);

  const handleHeroPlay = useCallback(() => {
    if (isLive) {
      togglePlay();
      return;
    }
    if (playing) {
      toggle();
      return;
    }
    playFeaturedPlaylist();
  }, [isLive, playing, toggle, togglePlay, playFeaturedPlaylist]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section
      className="relative -mx-3 flex min-h-[470px] flex-col overflow-hidden rounded-b-[34px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:min-h-[400px] sm:rounded-[32px] lg:min-h-[400px]"
      aria-live={isLive ? "polite" : "off"}
    >
      {/* Cover art — bleed slightly past edges so no light strip shows on mobile */}
      <div
        className="absolute -inset-px bg-cover bg-center transition-[background-image] duration-500"
        style={{ backgroundImage: `url(${displaySong.coverSrc})` }}
        aria-hidden
      />

      {/* Dark overlay — matched inset so it stays flush with hero edges */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px transition-opacity duration-500",
          isLive
            ? "bg-gradient-to-t from-[rgba(7,12,16,0.98)] via-[rgba(7,12,16,0.78)] to-[rgba(7,12,16,0.42)]"
            : "bg-gradient-to-b from-[rgba(7,12,16,0.88)] via-[rgba(7,12,16,0.62)] to-[rgba(7,12,16,0.28)] sm:bg-gradient-to-r sm:from-[rgba(7,12,16,0.96)] sm:via-[rgba(7,12,16,0.76)] sm:to-[rgba(7,12,16,0.12)]",
        )}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col">
        <div className="px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-[34px] sm:pt-[34px]">
          <Topbar variant="embedded" />
        </div>

        <div className="mt-auto w-full p-6 sm:p-[34px] sm:pt-5">
          <div className="max-w-3xl">
            {isLive ? (
              <>
                <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[rgba(255,111,177,0.35)] bg-[rgba(255,111,177,0.14)] px-3 py-2 text-[13px] font-extrabold text-[var(--family-pink)]">
                  <StatusDot playing={isPlaying} />
                  {isPlaying ? "Now playing" : "Paused"} · {displayAuthor?.name ?? "Family"}
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--jb-muted)]">
                  {BRAND_NAME}
                </p>
                <h1 className="mt-2 text-[clamp(32px,8vw,64px)] leading-[0.92] font-extrabold tracking-[-0.06em]">
                  {displaySong.title}
                </h1>
                {displaySong.subtitle ? (
                  <p className="mt-3 max-w-[540px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
                    {displaySong.subtitle}
                  </p>
                ) : null}
                <div className="mt-5 max-w-md">
                  <div className="flex items-center gap-2.5 text-[11px] font-bold text-[var(--jb-muted-2)]">
                    <span>{formatTime(currentTime)}</span>
                    <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-white/15">
                      <div
                        className="family-progress h-full transition-[width] duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
                  ✨ Today&apos;s spotlight · {displayAuthor?.name ?? "Family"}
                </span>
                <h1 className="text-[clamp(48px,12vw,92px)] leading-[0.88] font-extrabold tracking-[-0.075em]">
                  {BRAND_NAME}
                </h1>
                <p className="mt-4 max-w-[540px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
                  Cousin songs, silly anthems, and the tracks we made together — tap play and the
                  whole shelf keeps going.
                </p>
                <p className="mt-3 text-sm font-bold text-[var(--family-ocean)]">
                  Today&apos;s rotation: {spotlightNames}
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--family-pink)]">{featured.title}</p>
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PlayIconButton
                size="xl"
                playing={isLive ? isPlaying : playing}
                label={isLive ? "Toggle playback" : "Play featured playlist"}
                onClick={handleHeroPlay}
              />
              {!isLive ? (
                <>
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
                    Play spotlight only
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => playQueue(familyQueue, 0)}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] [-webkit-tap-highlight-color:transparent] hover:text-white"
                >
                  Play family mix
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
