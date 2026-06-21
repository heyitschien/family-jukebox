"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { AlbumBundle } from "@/data/albums";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type AlbumHeroShowcaseProps = {
  bundles: AlbumBundle[];
};

function ActiveAlbumPanel({ bundle, leadSong }: { bundle: AlbumBundle; leadSong: Song }) {
  const { playing, toggle } = useSongPlayback(leadSong, { playlist: bundle.songs });

  return (
    <div className="mt-5 rounded-2xl border border-white/[0.1] bg-white/[0.06] p-4">
      <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--jb-muted)]">
        Now featuring
      </p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight">{bundle.album.title}</h2>
      <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
        {bundle.artist.name} · {bundle.songs.length} {bundle.songs.length === 1 ? "track" : "tracks"}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <PlayIconButton
          size="xl"
          playing={playing}
          label={playing ? `Pause ${bundle.album.title}` : `Play ${bundle.album.title}`}
          onClick={toggle}
        />
        <Link
          href={`/albums/${bundle.album.slug}`}
          className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-[var(--jb-muted)] hover:text-white"
        >
          Open album
        </Link>
      </div>
    </div>
  );
}

function AlbumTrackPreview({ song, playlist }: { song: Song; playlist: Song[] }) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });

  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5",
        isCurrent ? "border-[rgba(255,111,177,0.35)] bg-white/[0.1]" : "border-white/[0.08] bg-white/[0.06]",
      )}
    >
      <span className="min-w-0 truncate text-sm font-bold">{song.title}</span>
      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
      />
    </li>
  );
}

export function AlbumHeroShowcase({ bundles }: AlbumHeroShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (bundles.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % bundles.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [bundles.length]);

  const activeBundle = bundles[activeIndex];
  const stack = useMemo(() => {
    if (bundles.length === 0) return [];
    return Array.from({ length: Math.min(3, bundles.length) }, (_, offset) => {
      const idx = (activeIndex + offset) % bundles.length;
      return { bundle: bundles[idx], depth: offset };
    });
  }, [activeIndex, bundles]);

  if (!activeBundle) return null;
  const leadSong = activeBundle.songs[0];
  if (!leadSong) return null;

  return (
    <section className="relative -mx-3 overflow-hidden rounded-b-[34px] border border-white/[0.08] bg-[rgba(11,15,20,0.75)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:mx-0 sm:rounded-[32px] sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 18%, ${activeBundle.album.accentFrom}40 0%, transparent 45%), radial-gradient(circle at 90% 10%, ${activeBundle.album.accentTo}44 0%, transparent 40%)`,
        }}
      />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[var(--jb-muted)]">
            Album premiere
          </p>
          <h1 className="mt-2 text-[clamp(34px,8vw,72px)] leading-[0.92] font-extrabold tracking-[-0.06em]">
            Family albums in motion
          </h1>
          <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-[var(--jb-muted)] sm:text-base">
            Every creator now has a replayable album made from the songs already in Family Jukebox.
            Explore the stack, press play, and let each album run as a full listening session.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {bundles.map((bundle, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={bundle.album.slug}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-extrabold transition",
                    active
                      ? "border-transparent bg-family-accent text-[#1a0812]"
                      : "border-white/[0.1] bg-white/[0.07] text-[var(--jb-muted)] hover:text-white",
                  )}
                >
                  {bundle.artist.name}
                </button>
              );
            })}
          </div>

          <ActiveAlbumPanel bundle={activeBundle} leadSong={leadSong} />
        </div>

        <div className="grid gap-4">
          <div className="relative h-[260px] [perspective:1200px]">
            {stack.map(({ bundle, depth }) => (
              <Link
                key={bundle.album.slug}
                href={`/albums/${bundle.album.slug}`}
                className="absolute inset-x-4 top-0 block rounded-[20px] border border-white/[0.09] bg-[#0f141b]/90 p-3 shadow-[0_18px_36px_rgba(0,0,0,0.36)] transition duration-500"
                style={{
                  transform: `translate3d(${depth * 20}px, ${depth * 16}px, ${-depth * 40}px) rotateY(${-8 + depth * 6}deg) scale(${1 - depth * 0.06})`,
                  zIndex: 30 - depth,
                }}
              >
                <div
                  className="rounded-xl p-2"
                  style={{
                    background: `linear-gradient(130deg, ${bundle.album.accentFrom}2E 0%, ${bundle.album.accentTo}1A 100%)`,
                  }}
                >
                  <CoverImage
                    src={bundle.album.coverSrc}
                    alt={`${bundle.album.title} cover`}
                    className="aspect-square w-full rounded-[14px]"
                  />
                </div>
                <p className="mt-2 truncate text-sm font-extrabold">{bundle.album.title}</p>
              </Link>
            ))}
          </div>

          <ul className="grid gap-2">
            {activeBundle.songs.slice(0, 3).map((song) => (
              <AlbumTrackPreview key={song.slug} song={song} playlist={activeBundle.songs} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
