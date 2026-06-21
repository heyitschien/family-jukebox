"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";

import { CoverImage } from "@/components/cover-image";
import { formatTime, usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { getSpotlightAuthorNames } from "@/lib/featured-rotation";
import { PlayIconButton } from "@/components/play-icon-button";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  featured: Song;
  playlist: Song[];
  familyQueue: Song[];
};

export function HeroSection({ featured, playlist, familyQueue }: HeroSectionProps) {
  const { currentSong, currentTime, duration, isPlaying, playQueue, playSong, queue, togglePlay } =
    usePlayer();
  const activeSong = currentSong ?? featured;
  const author = getMemberBySlug(activeSong.authorSlug);
  const spotlightNames = getSpotlightAuthorNames();
  const isLive = currentSong !== null;
  const progress = isLive && duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  const activeQueue = useMemo(() => {
    const source = isLive && queue.length > 0 ? queue : playlist;
    return source.length > 0 ? source : [activeSong];
  }, [activeSong, isLive, playlist, queue]);

  const previewQueue = useMemo(() => {
    const startIndex = activeQueue.findIndex((song) => song.slug === activeSong.slug);
    const normalizedIndex = startIndex >= 0 ? startIndex : 0;
    return activeQueue.slice(normalizedIndex, normalizedIndex + 3);
  }, [activeQueue, activeSong.slug]);

  const playFeaturedPlaylist = useCallback(() => {
    const idx = playlist.findIndex((song) => song.slug === featured.slug);
    playQueue(playlist, idx >= 0 ? idx : 0);
  }, [featured.slug, playQueue, playlist]);

  const handleHeroPlay = useCallback(() => {
    if (currentSong) {
      togglePlay();
      return;
    }
    playFeaturedPlaylist();
  }, [currentSong, playFeaturedPlaylist, togglePlay]);

  const handleFamilyMix = useCallback(() => {
    const idx = familyQueue.findIndex((song) => song.slug === activeSong.slug);
    playQueue(familyQueue, idx >= 0 ? idx : 0);
  }, [activeSong.slug, familyQueue, playQueue]);

  return (
    <section className="relative -mx-3 overflow-hidden rounded-b-[34px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:rounded-[32px]">
      <div className="absolute inset-0">
        <CoverImage src={activeSong.coverSrc} alt="" className="size-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,12,16,0.24)_0%,rgba(7,12,16,0.48)_30%,rgba(7,12,16,0.92)_100%)] sm:bg-[linear-gradient(90deg,rgba(7,12,16,0.88)_0%,rgba(7,12,16,0.64)_52%,rgba(7,12,16,0.2)_100%)]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(5,9,13,0.92)_0%,rgba(5,9,13,0.72)_42%,rgba(5,9,13,0)_100%)] sm:w-[70%]" />
      </div>

      <div className="relative z-10 grid min-h-[620px] gap-8 p-5 sm:min-h-[500px] sm:p-[34px] lg:min-h-[420px] lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
        <div className="max-w-3xl">
          <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
            {isLive ? "▶ Live now" : "✨ Today&apos;s spotlight"} · {author?.name ?? "Family"}
          </span>
          <h1 className="text-[clamp(46px,12vw,92px)] leading-[0.9] font-extrabold tracking-[-0.075em]">
            Family Jukebox
          </h1>
          <p className="mt-4 max-w-[620px] text-base leading-relaxed text-[var(--jb-muted)] sm:text-lg">
            A clean home for the songs we make together - colorful covers, easy playback, and a
            landing page that turns into a live now-playing moment the second someone hits play.
          </p>

          <div className="mt-6 max-w-[650px] rounded-[26px] border border-white/[0.08] bg-[rgba(7,12,16,0.52)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] backdrop-blur-[14px] sm:p-5">
            <p
              className={cn(
                "text-[11px] font-black tracking-[0.22em] uppercase",
                isLive ? "text-[var(--family-pink)]" : "text-[var(--family-ocean)]",
              )}
            >
              {isLive ? "Now featured on the landing page" : "Featured right now"}
            </p>
            <h2 className="mt-2 text-[30px] leading-tight font-extrabold tracking-tight text-white sm:text-[40px]">
              {activeSong.title}
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-[var(--jb-muted)] sm:text-[15px]">
              {activeSong.subtitle ??
                `${author?.name ?? "Family"} is up next with a song worth replaying.`}
            </p>
            <p
              className={cn(
                "mt-3 text-sm font-bold",
                isLive ? "text-[var(--family-glow)]" : "text-[var(--family-ocean)]",
              )}
            >
              {isLive
                ? queue.length > 1
                  ? `${queue.length} songs are lined up in the live queue.`
                  : "Single-song replay, front and center."
                : `Rotating spotlight from ${spotlightNames}.`}
            </p>
            {isLive ? (
              <div className="mt-4 max-w-[320px]">
                <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-[var(--jb-muted-2)]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="h-[6px] overflow-hidden rounded-full bg-white/12">
                  <div className="family-progress h-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PlayIconButton
              size="xl"
              playing={isLive ? isPlaying : false}
              label={isLive ? "Toggle live player" : "Play spotlight playlist"}
              onClick={handleHeroPlay}
            />
            <button
              type="button"
              onClick={handleFamilyMix}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608] [-webkit-tap-highlight-color:transparent]"
            >
              Play family mix
            </button>
            <button
              type="button"
              onClick={() => playSong(activeSong)}
              className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] [-webkit-tap-highlight-color:transparent] hover:text-white"
            >
              {isLive ? "Replay just this song" : "Play spotlight only"}
            </button>
          </div>
        </div>

        <HeroPhonePreview
          song={activeSong}
          isLive={isLive}
          isPlaying={isLive ? isPlaying : false}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          queuePreview={previewQueue}
          onPlayPause={handleHeroPlay}
        />
      </div>
    </section>
  );
}

type HeroPhonePreviewProps = {
  song: Song;
  isLive: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  queuePreview: Song[];
  onPlayPause: () => void;
};

function HeroPhonePreview({
  song,
  isLive,
  isPlaying,
  currentTime,
  duration,
  progress,
  queuePreview,
  onPlayPause,
}: HeroPhonePreviewProps) {
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div className="mx-auto w-full max-w-[320px] lg:max-w-none">
      <div className="relative rounded-[40px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(8,12,18,0.94)_0%,rgba(10,15,22,0.98)_100%)] p-2.5 shadow-[0_22px_80px_rgba(0,0,0,0.42)]">
        <div className="absolute inset-x-[72px] top-2.5 h-6 rounded-full bg-black/75" />
        <div className="overflow-hidden rounded-[32px] border border-white/[0.06] bg-[#071015]">
          <div className="relative aspect-[9/16]">
            <CoverImage src={song.coverSrc} alt="" className="absolute inset-0 size-full" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,14,0.12)_0%,rgba(6,10,14,0.34)_30%,rgba(6,10,14,0.96)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,rgba(7,16,21,0)_0%,rgba(7,16,21,0.18)_12%,rgba(7,16,21,1)_100%)]" />

            <div className="relative flex h-full flex-col justify-between p-4 pt-10">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
                <span>Family Jukebox</span>
                <span>{isLive ? "Live" : "Spotlight"}</span>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[rgba(7,12,16,0.74)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.2)] backdrop-blur-md">
                <span className="inline-flex rounded-full border border-white/10 bg-white/8 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--family-glow)]">
                  {isLive ? "Now playing" : "Featured song"}
                </span>
                <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">{song.title}</h3>
                <p className="mt-1 text-sm font-bold text-[var(--family-ocean)]">
                  {author?.name ?? "Family"} · {song.tags.slice(0, 2).join(" · ")}
                </p>
                {song.subtitle ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--jb-muted)]">
                    {song.subtitle}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center gap-3">
                  <PlayIconButton
                    size="sm"
                    playing={isPlaying}
                    label={isLive ? "Toggle live player" : "Play featured song"}
                    onClick={onPlayPause}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-white/65">
                      <span>{isLive ? formatTime(currentTime) : "Ready to play"}</span>
                      <span>{isLive ? formatTime(duration) : "Tap any track"}</span>
                    </div>
                    <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-white/12">
                      <div
                        className="family-progress h-full transition-all"
                        style={{ width: `${isLive ? progress : 18}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {queuePreview.map((item) => {
                    const itemAuthor = getMemberBySlug(item.authorSlug);
                    const current = item.slug === song.slug;

                    return (
                      <Link
                        key={item.slug}
                        href={`/songs/${item.slug}`}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border px-2.5 py-2 transition hover:bg-white/10",
                          current
                            ? "border-[rgba(255,111,177,0.3)] bg-white/10"
                            : "border-white/[0.07] bg-black/10",
                        )}
                      >
                        <CoverImage src={item.coverSrc} alt="" className="size-11 rounded-xl" />
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "truncate text-sm font-bold",
                              current ? "text-[var(--family-glow)]" : "text-white",
                            )}
                          >
                            {item.title}
                          </p>
                          <p className="truncate text-[12px] text-[var(--jb-muted)]">
                            {itemAuthor?.name ?? "Family"}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={`/songs/${song.slug}`}
                  className="mt-4 inline-flex text-sm font-bold text-[var(--family-glow)] hover:text-white"
                >
                  Open song page →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
