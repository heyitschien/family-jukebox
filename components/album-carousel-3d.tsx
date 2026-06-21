"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ArtistLink } from "@/components/artist-link";
import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { Topbar } from "@/components/topbar";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumSongs, type Album } from "@/data/albums";
import { getAlbumAuthor } from "@/data/albums";
import { getFairRotationQueue } from "@/lib/featured-rotation";
import { getAlbumHeroBadge, getSpotlightAlbumAuthorNames } from "@/lib/album-rotation";
import { cn } from "@/lib/utils";

type AlbumCarousel3DProps = {
  albums: Album[];
  featuredAlbum: Album;
  refreshSeed: number;
};

export function AlbumCarousel3D({ albums, featuredAlbum, refreshSeed }: AlbumCarousel3DProps) {
  const router = useRouter();
  const { playQueue, currentSong, isPlaying, queue, togglePlay } = usePlayer();
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

  useEffect(() => {
    if (isPaused || albums.length <= 1) return;
    const timer = setInterval(rotateNext, 6000);
    return () => clearInterval(timer);
  }, [isPaused, albums.length, rotateNext]);

  const playActiveAlbum = useCallback(() => {
    if (activeSongs.length === 0) return;
    playQueue(activeSongs, 0);
  }, [activeSongs, playQueue]);

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
    if (delta < 0) rotateNext();
    else rotatePrev();
  };

  const count = albums.length;
  const angleStep = count > 0 ? 360 / count : 0;
  const coverSize = count <= 5 ? 180 : 160;
  const radius =
    count <= 3 ? 140 : count <= 5 ? 168 : count <= 6 ? 175 : Math.min(200, Math.round(coverSize / Math.sin(Math.PI / count)));

  return (
    <section
      className="relative -mx-3 max-w-[100vw] overflow-hidden rounded-b-[34px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.35)] [contain:paint] sm:mx-0 sm:max-w-full sm:rounded-[32px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative z-20 px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-[34px] sm:pt-[34px]">
        <Topbar variant="embedded" />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${activeAlbum.accentColor}33 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(108,183,255,0.12) 0%, transparent 40%),
            linear-gradient(180deg, #070c10 0%, #0b0f14 60%, #07090c 100%)`,
        }}
      />

      <div className="relative z-10 grid gap-6 p-6 sm:grid-cols-[1fr_1.1fr] sm:items-center sm:gap-8 sm:p-[34px] lg:min-h-[400px]">
        {/* 3D Carousel */}
        <div
          className="relative mx-auto flex h-[280px] w-full max-w-[340px] items-center justify-center overflow-hidden [contain:paint] sm:h-[320px] sm:max-w-none"
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
                  <CoverImage src={album.coverSrc} alt="" className="size-full" />
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
                              rotateTo(i);
                              playQueue(albumSongs, 0);
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
                  onClick={() => rotateTo(i)}
                  className="absolute top-1/2 left-1/2 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent]"
                  style={coverStyle}
                  aria-label={`View ${album.title}`}
                >
                  {coverInner}
                </button>
              );
            })}
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1.5">
            {albums.map((album, i) => (
              <button
                key={album.slug}
                type="button"
                onClick={() => rotateTo(i)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  i === activeIndex ? "w-5 bg-[var(--family-pink)]" : "bg-white/25 hover:bg-white/40",
                )}
                aria-label={`Go to ${album.title}`}
              />
            ))}
          </div>
        </div>

        {/* Hero copy + actions */}
        <div className="relative z-10 min-w-0">
          <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-family-soft bg-family-soft px-3 py-2 text-[13px] font-extrabold text-family-glow">
            {heroBadge.emoji} {heroBadge.prefix}
            {author ? (
              <ArtistLink member={author} className="text-family-glow" />
            ) : (
              "Family"
            )}
          </span>
          <h1 className="text-[clamp(40px,10vw,72px)] leading-[0.9] font-extrabold tracking-[-0.06em]">
            Family Jukebox
          </h1>
          <Link
            href={`/albums/${activeAlbum.slug}`}
            className="mt-3 block text-lg font-bold transition hover:underline"
            style={{ color: activeAlbum.accentColor }}
          >
            {activeAlbum.title}
          </Link>
          <p className="mt-1 text-sm text-[var(--jb-muted)]">
            {activeAlbum.subtitle ?? `${activeSongs.length} songs`}
            {author ? (
              <>
                {" · "}
                <ArtistLink member={author} className="text-[var(--jb-muted)] hover:text-white" />
              </>
            ) : null}
          </p>
          <p className="mt-3 max-w-[480px] text-sm leading-relaxed text-[var(--jb-muted)]">
            Spin through cousin albums — silly fox trails, gravity shifts, pink glasses, and every
            family anthem in one place.
          </p>
          <p className="mt-2 text-xs font-bold text-[var(--family-ocean)]">
            Rotating spotlight: {spotlightNames}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PlayIconButton
              size="xl"
              playing={isAlbumPlaying}
              label={isAlbumPlaying ? "Pause album" : `Play ${activeAlbum.title}`}
              onClick={handlePlayToggle}
            />
            <button
              type="button"
              onClick={() => playQueue(familyQueue, 0)}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608] [-webkit-tap-highlight-color:transparent]"
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
            className="mt-4 inline-block text-xs font-bold text-[var(--jb-muted)] hover:text-[var(--family-pink)]"
          >
            Browse all albums →
          </Link>
        </div>
      </div>
    </section>
  );
}
