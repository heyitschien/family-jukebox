"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { AlbumCoverRotator, getPlayStartIndex } from "@/components/album-cover-rotator";
import { ArtistLink } from "@/components/artist-link";
import { PlayIconButton } from "@/components/play-icon-button";
import { Topbar } from "@/components/topbar";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumAuthor, getAlbumForSong, getAlbumSongs, type Album } from "@/data/albums";
import { useInteractionGuard } from "@/hooks/use-interaction-guard";
import { getCarouselRingLayout } from "@/lib/carousel-layout";
import { getFairRotationQueue } from "@/lib/featured-rotation";
import {
  getAlbumHeroBadge,
  getAlbumSongsByRecency,
  getAlbumSpotlightSong,
  getAlbumSpotlightSongIndex,
  getSpotlightAlbumAuthorNames,
} from "@/lib/album-rotation";
import { getHeroAlbumDescription, getHeroStatsLine, HERO_WANDER_COPY } from "@/lib/hero-copy";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { BrandAccentIcon } from "@/components/brand/brand-accent-icon";
import { cn } from "@/lib/utils";

type AlbumCarousel3DProps = {
  albums: Album[];
  featuredAlbum: Album;
  refreshSeed: number;
  listenerAge?: number | null;
  audienceMicrocopy?: string;
};

const PLAYBACK_SYNC_DEBOUNCE_MS = 400;

export function AlbumCarousel3D({
  albums,
  featuredAlbum,
  refreshSeed,
  audienceMicrocopy,
}: AlbumCarousel3DProps) {
  const router = useRouter();
  const { playQueue, currentSong, isPlaying, queue, togglePlay } = usePlayer();
  const { canAutoSync, markInteraction } = useInteractionGuard();
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      albums.findIndex((a) => a.slug === featuredAlbum.slug),
    ),
  );
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const familyQueue = getFairRotationQueue(refreshSeed);

  const activeAlbum = albums[activeIndex] ?? featuredAlbum;
  const activeSongs = getAlbumSongs(activeAlbum);
  const activeSpotlightSong = getAlbumSpotlightSong(activeAlbum, refreshSeed);
  const author = getAlbumAuthor(activeAlbum);
  const spotlightNames = getSpotlightAlbumAuthorNames();
  const heroBadge = getAlbumHeroBadge(activeAlbum, featuredAlbum);

  const isAlbumPlaying =
    isPlaying &&
    activeSongs.length > 0 &&
    activeSongs.some((s) => s.slug === currentSong?.slug) &&
    queue.length > 0 &&
    queue.every((q, i) => activeSongs[i]?.slug === q.slug);

  const rotateTo = useCallback(
    (index: number) => {
      if (albums.length === 0) return;
      const normalized = ((index % albums.length) + albums.length) % albums.length;
      setActiveIndex(normalized);
    },
    [albums.length],
  );

  const rotateNext = useCallback(() => rotateTo(activeIndex + 1), [activeIndex, rotateTo]);
  const rotatePrev = useCallback(() => rotateTo(activeIndex - 1), [activeIndex, rotateTo]);

  const rotateToUser = useCallback(
    (index: number) => {
      markInteraction();
      rotateTo(index);
    },
    [markInteraction, rotateTo],
  );

  const playbackAlbum = currentSong ? getAlbumForSong(currentSong) : undefined;
  const playbackAlbumIndex = playbackAlbum
    ? albums.findIndex((album) => album.slug === playbackAlbum.slug)
    : -1;
  const isPlaybackSyncing =
    isPlaying &&
    currentSong !== null &&
    playbackAlbumIndex >= 0 &&
    activeIndex === playbackAlbumIndex;
  const shouldPauseAutoRotate = isPaused || isPlaybackSyncing;

  useEffect(() => {
    const song = currentSong;
    if (!isPlaying || !song || !canAutoSync) return;

    const timer = window.setTimeout(() => {
      const album = getAlbumForSong(song);
      if (!album) return;

      const index = albums.findIndex((entry) => entry.slug === album.slug);
      if (index < 0 || index === activeIndex) return;

      rotateTo(index);
    }, PLAYBACK_SYNC_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, albums, canAutoSync, currentSong, isPlaying, rotateTo]);

  useEffect(() => {
    if (shouldPauseAutoRotate || albums.length <= 1) return;
    const timer = setInterval(rotateNext, 6000);
    return () => clearInterval(timer);
  }, [shouldPauseAutoRotate, albums.length, rotateNext]);

  const playAlbum = useCallback(
    (album: Album, displaySong = getAlbumSpotlightSong(album, refreshSeed)) => {
      const albumSongs = getAlbumSongs(album);
      if (albumSongs.length === 0) return;
      const startIndex = getPlayStartIndex(albumSongs, displaySong);
      playQueue(albumSongs, startIndex, "hero");
    },
    [playQueue, refreshSeed],
  );

  const playActiveAlbum = useCallback(() => {
    playAlbum(activeAlbum, activeSpotlightSong);
  }, [activeAlbum, activeSpotlightSong, playAlbum]);

  const handlePlayToggle = useCallback(() => {
    if (isAlbumPlaying) {
      togglePlay();
      return;
    }
    playActiveAlbum();
  }, [isAlbumPlaying, playActiveAlbum, togglePlay]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) < 40) return;
    markInteraction();
    if (delta < 0) rotateNext();
    else rotatePrev();
  };

  const count = albums.length;
  const angleStep = count > 0 ? 360 / count : 0;
  const layout = getCarouselRingLayout(count);
  const { coverSize, radius, dotSizeClass, activeDotWidthClass, maxDotsVisible } = layout;

  const dotWindowStart =
    count <= maxDotsVisible
      ? 0
      : Math.max(0, Math.min(activeIndex - Math.floor(maxDotsVisible / 2), count - maxDotsVisible));
  const visibleDots = albums.slice(dotWindowStart, dotWindowStart + maxDotsVisible);

  return (
    <section
      className="relative -mx-3 overflow-hidden rounded-b-[34px] border border-white/[0.05] shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:mx-0 sm:rounded-[32px]"
      onMouseEnter={() => {
        setIsPaused(true);
        markInteraction();
      }}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative z-20 px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-[34px] sm:pt-[34px]">
        <Topbar variant="embedded" />
      </div>

      <div
        className="jb-hero-glow pointer-events-none absolute inset-0"
        style={
          {
            "--hero-accent-glow": `radial-gradient(ellipse at 30% 20%, ${activeAlbum.accentColor}33 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(108,183,255,0.12) 0%, transparent 40%)`,
          } as React.CSSProperties
        }
      />

      <div className="relative z-10 grid gap-6 p-6 sm:grid-cols-[1fr_1.1fr] sm:items-center sm:gap-8 sm:p-[34px] lg:min-h-[400px]">
        <div
          className="relative mx-auto flex h-[280px] w-full max-w-[340px] items-center justify-center sm:h-[320px] sm:max-w-none"
          style={{ perspective: "1200px" }}
        >
          <div
            className="relative size-full"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-activeIndex * angleStep}deg)`,
              transition: "transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1)",
            }}
          >
            {albums.map((album, i) => {
              const angle = i * angleStep;
              const isFront = i === activeIndex;
              const albumAuthor = getAlbumAuthor(album);
              const albumSongs = getAlbumSongs(album);
              const recencySongs = getAlbumSongsByRecency(album);
              const spotlightSongIndex = getAlbumSpotlightSongIndex(album, refreshSeed);
              const spotlightSong = recencySongs[spotlightSongIndex];
              const albumIsPlaying =
                isPlaying &&
                albumSongs.length > 0 &&
                albumSongs.some((s) => s.slug === currentSong?.slug) &&
                queue.length > 0 &&
                queue.every((q, j) => albumSongs[j]?.slug === q.slug);

              const coverStyle = {
                width: `${coverSize}px`,
                height: `${coverSize}px`,
                marginLeft: `-${coverSize / 2}px`,
                marginTop: `-${coverSize / 2}px`,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                transformStyle: "preserve-3d" as const,
                transition: "transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 400ms",
                opacity: isFront ? 1 : 0.5,
                zIndex: isFront ? 10 : 1,
              };

              const coverInner = (
                <div
                  className={cn(
                    "relative size-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-500",
                    isFront && albumIsPlaying && "ring-2 ring-[var(--family-pink)] ring-offset-2 ring-offset-[#0b0f14]",
                  )}
                  style={{
                    transform: isFront ? "scale(1.05)" : "scale(0.82)",
                    boxShadow: isFront
                      ? `0 24px 60px ${album.accentColor}44, 0 8px 24px rgba(0,0,0,0.4)`
                      : "0 12px 32px rgba(0,0,0,0.3)",
                  }}
                >
                  <AlbumCoverRotator
                    key={`${album.slug}-${isFront ? "front" : `side-${spotlightSongIndex}`}`}
                    album={album}
                    songs={recencySongs}
                    initialSongIndex={spotlightSongIndex}
                    isFront={isFront}
                    isPaused={shouldPauseAutoRotate}
                    className="size-full"
                  />
                  {isFront ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div
                        className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <PlayIconButton
                          size="lg"
                          playing={albumIsPlaying}
                          label={albumIsPlaying ? "Pause album" : `Play ${album.title}`}
                          onClick={() => {
                            if (i === activeIndex) {
                              handlePlayToggle();
                            } else {
                              rotateToUser(i);
                              playAlbum(album, spotlightSong);
                            }
                          }}
                          className="shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                        {albumAuthor ? (
                          <ArtistLink
                            member={albumAuthor}
                            className="truncate text-xs text-white"
                            onClick={(event) => event.stopPropagation()}
                          />
                        ) : (
                          <p className="truncate text-xs font-bold text-white">Family</p>
                        )}
                        {recencySongs.length > 1 ? (
                          <p className="truncate text-[10px] text-white/75">
                            {recencySongs.length} songs · latest tracks
                          </p>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8"
                      style={{ opacity: 0 }}
                    >
                      <p className="truncate text-xs font-bold text-white">
                        {albumAuthor?.name ?? "Family"}
                      </p>
                    </div>
                  )}
                </div>
              );

              if (isFront) {
                return (
                  <div
                    key={album.slug}
                    className="absolute top-1/2 left-1/2"
                    style={coverStyle}
                  >
                    <button
                      type="button"
                      onClick={() => router.push(`/albums/${album.slug}`)}
                      className="block size-full cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent]"
                      aria-label={`Open ${album.title}`}
                    >
                      {coverInner}
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={album.slug}
                  type="button"
                  onClick={() => rotateToUser(i)}
                  className="absolute top-1/2 left-1/2 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent]"
                  style={coverStyle}
                  aria-label={`View ${album.title}`}
                >
                  {coverInner}
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-1/2 flex max-w-[min(100%,280px)] -translate-x-1/2 items-center gap-1.5 overflow-hidden px-2">
            {dotWindowStart > 0 ? (
              <span className="text-[10px] text-white/35" aria-hidden>
                ···
              </span>
            ) : null}
            {visibleDots.map((album, offset) => {
              const i = dotWindowStart + offset;
              return (
                <button
                  key={album.slug}
                  type="button"
                  onClick={() => rotateToUser(i)}
                  className={cn(
                    "shrink-0 rounded-full transition-all",
                    dotSizeClass,
                    i === activeIndex
                      ? cn(activeDotWidthClass, "cr-dot-active")
                      : "bg-white/25 hover:bg-white/40",
                  )}
                  aria-label={`Go to ${album.title}`}
                />
              );
            })}
            {dotWindowStart + maxDotsVisible < count ? (
              <span className="text-[10px] text-white/35" aria-hidden>
                ···
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative z-10 flex min-w-0 flex-col">
          <span className="mb-3.5 flex w-fit max-w-full items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
            {heroBadge.emoji} {heroBadge.prefix}
            {author ? (
              <ArtistLink member={author} className="text-family-glow" />
            ) : (
              "Family"
            )}
          </span>
          <BrandWordmark
            variant="hero"
            showLogo={false}
            showSignature
            className="w-full gap-0"
          />
          <Link
            href={`/albums/${activeAlbum.slug}`}
            className="mt-3 block transition hover:opacity-90"
          >
            <span className="text-sm font-bold uppercase tracking-[0.08em] text-[var(--jb-muted)]">
              Now spinning
            </span>
            <span
              className="mt-0.5 block text-lg font-bold hover:underline"
              style={{ color: activeAlbum.accentColor }}
            >
              {activeAlbum.title}
            </span>
          </Link>
          <p className="mt-2 max-w-[480px] text-sm leading-relaxed text-[var(--jb-muted)]">
            {getHeroAlbumDescription(activeAlbum, author ?? undefined)}
          </p>
          <p className="mt-3 max-w-[480px] text-sm leading-relaxed text-[var(--jb-muted)]">
            {HERO_WANDER_COPY}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-bold text-[var(--family-ocean)]">
            <BrandAccentIcon icon="users" className="text-[var(--family-ocean)]" />
            {audienceMicrocopy ? (
              <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[11px] text-[var(--jb-text)]">
                {audienceMicrocopy}
              </span>
            ) : null}
            <span>{getHeroStatsLine(count)}</span>
          </p>
          <span className="sr-only">Today&apos;s family spotlights: {spotlightNames}</span>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PlayIconButton
              size="xl"
              playing={isAlbumPlaying}
              label={isAlbumPlaying ? "Pause album" : `Play ${activeAlbum.title}`}
              onClick={handlePlayToggle}
            />
            <button
              type="button"
              onClick={() => playQueue(familyQueue, 0, "hero")}
              className="inline-flex min-h-11 items-center rounded-full bg-family-accent px-5 py-3 text-sm font-black text-[#1a0812] shadow-family [-webkit-tap-highlight-color:transparent]"
            >
              Play family mix
            </button>
            <Link
              href={`/albums/${activeAlbum.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
            >
              View album
            </Link>
          </div>

          <Link
            href="/albums"
            className="mt-4 inline-block text-xs font-bold text-[var(--jb-muted)] hover:text-cr-gradient"
          >
            Browse all albums →
          </Link>
        </div>
      </div>
    </section>
  );
}
