"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { Topbar } from "@/components/topbar";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumAuthor, getAlbumSongs, getAlbumsByAuthor, type Album } from "@/data/albums";
import { getFairRotationQueue } from "@/lib/featured-rotation";
import { getAlbumHeroBadge, getSpotlightAlbumAuthorNames } from "@/lib/album-rotation";
import { cn } from "@/lib/utils";

type AlbumCarousel3DProps = {
  albums: Album[];
  featuredAlbum: Album;
  refreshSeed: number;
};

export function AlbumCarousel3D({ albums, featuredAlbum, refreshSeed }: AlbumCarousel3DProps) {
  const { playQueue, currentSong, isPlaying, queue, togglePlay } = usePlayer();
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(
      0,
      albums.findIndex((a) => a.slug === featuredAlbum.slug),
    ),
  );
  const [isPaused, setIsPaused] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const touchStartX = useRef(0);
  const familyQueue = getFairRotationQueue(refreshSeed);

  const activeAlbum = albums[activeIndex] ?? featuredAlbum;
  const activeSongs = getAlbumSongs(activeAlbum);
  const author = getAlbumAuthor(activeAlbum);
  const spotlightNames = getSpotlightAlbumAuthorNames();
  const heroBadge = getAlbumHeroBadge(activeAlbum, featuredAlbum);
  const siblingAlbums = author
    ? getAlbumsByAuthor(author.slug).filter((album) => album.slug !== activeAlbum.slug).slice(0, 3)
    : [];

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
      setQuickViewOpen(false);
      setActiveIndex(normalized);
    },
    [albums.length],
  );

  const rotateNext = useCallback(() => rotateTo(activeIndex + 1), [activeIndex, rotateTo]);
  const rotatePrev = useCallback(() => rotateTo(activeIndex - 1), [activeIndex, rotateTo]);

  useEffect(() => {
    if (isPaused || quickViewOpen || albums.length <= 1) return;
    const timer = setInterval(rotateNext, 6000);
    return () => clearInterval(timer);
  }, [isPaused, quickViewOpen, albums.length, rotateNext]);

  useEffect(() => {
    if (!quickViewOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickViewOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [quickViewOpen]);

  const playActiveAlbum = () => {
    if (activeSongs.length === 0) return;
    playQueue(activeSongs, 0);
  };

  const handlePlayToggle = () => {
    if (isAlbumPlaying) {
      togglePlay();
      return;
    }
    playActiveAlbum();
  };

  const handleCardActivate = useCallback(
    (index: number) => {
      if (index !== activeIndex) {
        rotateTo(index);
        return;
      }
      setQuickViewOpen(true);
    },
    [activeIndex, rotateTo],
  );

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
      className="relative -mx-3 overflow-hidden rounded-b-[34px] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:rounded-[32px]"
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
              const authorName = getAlbumAuthor(album)?.name ?? "Family";

              return (
                <div
                  key={album.slug}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardActivate(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCardActivate(i);
                    }
                  }}
                  className="absolute top-1/2 left-1/2 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent]"
                  style={{
                    width: `${coverSize}px`,
                    height: `${coverSize}px`,
                    marginLeft: `-${coverSize / 2}px`,
                    marginTop: `-${coverSize / 2}px`,
                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                    transition: "transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 400ms",
                    opacity: isFront ? 1 : 0.5,
                    zIndex: isFront ? 10 : 1,
                  }}
                  aria-label={`View ${album.title}`}
                >
                  <div
                    className={cn(
                      "relative size-full overflow-hidden rounded-2xl shadow-2xl transition-all duration-500",
                      isFront && isAlbumPlaying && "ring-2 ring-[var(--family-pink)] ring-offset-2 ring-offset-[#0b0f14]",
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
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                        <div
                          className="pointer-events-auto"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <PlayIconButton
                            size="lg"
                            playing={isAlbumPlaying}
                            label={isAlbumPlaying ? "Pause album" : `Play ${album.title}`}
                            onClick={handlePlayToggle}
                            className="shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-2 ring-black/20"
                          />
                        </div>
                      </div>
                    ) : null}
                    <div
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8"
                      style={{ opacity: isFront ? 1 : 0 }}
                    >
                      <p className="truncate text-xs font-bold text-white">{authorName}</p>
                    </div>
                  </div>
                </div>
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
          {author?.name ?? "Family"}
        </span>
          <h1 className="text-[clamp(40px,10vw,72px)] leading-[0.9] font-extrabold tracking-[-0.06em]">
            Family Jukebox
          </h1>
          <p className="mt-3 text-lg font-bold" style={{ color: activeAlbum.accentColor }}>
            {activeAlbum.title}
          </p>
          {author ? (
            <Link
              href={`/members/${author.slug}`}
              className="mt-1 inline-block text-sm font-bold text-[var(--jb-muted)] hover:text-white hover:underline"
            >
              by {author.name}
            </Link>
          ) : null}
          <p className="mt-1 text-sm text-[var(--jb-muted)]">
            {activeAlbum.subtitle ?? `${activeSongs.length} songs`}
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

      {quickViewOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/65 p-3 sm:items-center sm:p-6"
          role="dialog"
          aria-modal
          aria-label={`${activeAlbum.title} quick view`}
          onClick={() => setQuickViewOpen(false)}
        >
          <div
            className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[26px] border border-white/[0.1] bg-[#0b1016] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--jb-muted)]">
                  Album spotlight
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{activeAlbum.title}</h2>
                {author ? (
                  <Link
                    href={`/members/${author.slug}`}
                    className="mt-1 inline-block text-sm font-bold text-[var(--family-pink)] hover:underline"
                    onClick={() => setQuickViewOpen(false)}
                  >
                    {author.name}
                  </Link>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setQuickViewOpen(false)}
                className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-extrabold text-[var(--jb-muted)] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
              <CoverImage
                src={activeAlbum.coverSrc}
                alt={`${activeAlbum.title} cover`}
                className="mx-auto aspect-square w-full max-w-[220px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <PlayIconButton
                    size="xl"
                    playing={isAlbumPlaying}
                    label={isAlbumPlaying ? "Pause album" : `Play ${activeAlbum.title}`}
                    onClick={handlePlayToggle}
                  />
                  <Link
                    href={`/albums/${activeAlbum.slug}`}
                    className="inline-flex min-h-11 items-center rounded-full bg-white px-4 py-2.5 text-sm font-black text-[#050608]"
                    onClick={() => setQuickViewOpen(false)}
                  >
                    Open album page
                  </Link>
                  {author ? (
                    <Link
                      href={`/members/${author.slug}`}
                      className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-bold"
                      onClick={() => setQuickViewOpen(false)}
                    >
                      Open artist
                    </Link>
                  ) : null}
                </div>
                <p className="text-sm text-[var(--jb-muted)]">
                  Jump into tracks directly, then keep moving to the artist page or related albums.
                </p>
                <div className="space-y-2">
                  {activeSongs.slice(0, 6).map((song, i) => (
                    <button
                      key={song.slug}
                      type="button"
                      onClick={() => {
                        playQueue(activeSongs, i);
                        setQuickViewOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-left hover:bg-white/[0.08]"
                    >
                      <span className="truncate text-sm font-bold">{song.title}</span>
                      <span className="shrink-0 text-[11px] font-extrabold uppercase tracking-wide text-[var(--jb-muted)]">
                        Play
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {siblingAlbums.length > 0 ? (
              <div className="mt-5 border-t border-white/[0.08] pt-4">
                <p className="text-sm font-bold text-[var(--jb-muted)]">More from this artist</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {siblingAlbums.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/albums/${related.slug}`}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-bold hover:bg-white/[0.08]"
                      onClick={() => setQuickViewOpen(false)}
                    >
                      {related.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
