"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumCreator, getAlbumSongs, getAlbumTags, type Album } from "@/data/albums";
import type { Song } from "@/data/songs";

type AlbumHeroProps = {
  album: Album;
  stackAlbums: Album[];
  familyQueue: Song[];
};

export function AlbumHero({ album, stackAlbums, familyQueue }: AlbumHeroProps) {
  const { currentSong, isPlaying, playQueue, togglePlay } = usePlayer();
  const creator = getAlbumCreator(album);
  const albumSongs = getAlbumSongs(album);
  const albumTags = getAlbumTags(album).slice(0, 4);
  const leadSong = albumSongs[0];
  const isCurrentAlbum = albumSongs.some((song) => song.slug === currentSong?.slug);
  const isPlayingAlbum = isCurrentAlbum && isPlaying;

  if (!leadSong) {
    return null;
  }

  const handlePlayAlbum = () => {
    if (isCurrentAlbum) {
      togglePlay();
      return;
    }
    playQueue(albumSongs, 0);
  };

  return (
    <section
      className="relative overflow-hidden rounded-[34px] border border-white/[0.08] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] sm:p-7 lg:p-8"
      style={{
        backgroundImage: `linear-gradient(135deg, ${album.palette.surfaceAlt} 0%, ${album.palette.surface} 60%, rgba(7,12,16,0.98) 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-12 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: album.palette.glow }}
      />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em]"
              style={{ backgroundColor: album.palette.glow, color: album.palette.accent }}
            >
              Featured album
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">
              {album.kind}
            </span>
          </div>

          <p className="mt-4 text-sm font-bold text-white/65">
            Made from the songs already in the library for {creator?.name ?? "the family"}.
          </p>
          <h1 className="mt-3 text-[clamp(2.75rem,9vw,5.6rem)] leading-[0.92] font-black tracking-[-0.06em]">
            {album.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
            {album.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {albumTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-black text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <PlayIconButton
              size="xl"
              playing={isPlayingAlbum}
              label={isPlayingAlbum ? `Pause ${album.title}` : `Play ${album.title}`}
              onClick={handlePlayAlbum}
            />
            <Link
              href={`/albums/${album.slug}`}
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--jb-text)] px-5 py-3 text-sm font-black text-[#050608]"
            >
              View album
            </Link>
            <button
              type="button"
              onClick={() => playQueue(familyQueue, 0)}
              className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/[0.08] px-5 py-3 text-sm font-bold text-white/80"
            >
              Play family mix
            </button>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/8 bg-black/18 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">Creator</p>
              <p className="mt-1 text-base font-bold text-white">{creator?.name ?? "Family"}</p>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-black/18 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">Tracks</p>
              <p className="mt-1 text-base font-bold text-white">
                {albumSongs.length} {albumSongs.length === 1 ? "song" : "songs"}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-black/18 px-4 py-3">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/55">Lead song</p>
              <p className="mt-1 truncate text-base font-bold text-white">{leadSong.title}</p>
            </div>
          </div>
        </div>

        <div className="relative hidden h-[420px] lg:block">
          <div className="absolute right-0 top-0 h-full w-full">
            {stackAlbums.slice(0, 3).map((stackAlbum, index) => (
              <Link
                key={stackAlbum.slug}
                href={`/albums/${stackAlbum.slug}`}
                className="absolute right-0 top-0 block w-[280px] origin-bottom-right transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.01]"
                style={{
                  transform: `translate3d(${-36 * index}px, ${32 * index}px, 0) rotate(${index === 1 ? -5 : index === 2 ? 5 : -2}deg)`,
                  zIndex: 10 - index,
                }}
              >
                <div className="rounded-[28px] border border-white/10 bg-black/18 p-3 shadow-[0_18px_60px_rgba(0,0,0,0.34)] backdrop-blur-sm">
                  <CoverImage
                    src={stackAlbum.coverSrc}
                    alt={`${stackAlbum.title} cover`}
                    className="aspect-square w-full rounded-[22px]"
                  />
                  <div className="mt-3">
                    <p className="truncate text-lg font-black tracking-tight">{stackAlbum.title}</p>
                    <p className="truncate text-sm text-white/65">
                      {getAlbumCreator(stackAlbum)?.name ?? "Family"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <div className="absolute bottom-0 left-0 w-[300px] rounded-[30px] border border-white/10 bg-black/22 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.4)] backdrop-blur-sm">
              <CoverImage
                src={album.coverSrc}
                alt={`${album.title} cover`}
                className="aspect-square w-full rounded-[24px]"
              />
              <div className="mt-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-white/55">Now featuring</p>
                <p className="mt-1 text-2xl font-black tracking-tight">{album.title}</p>
                <p className="mt-1 text-sm text-white/72">{album.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
