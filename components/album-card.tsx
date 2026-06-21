"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { getAlbumCreator, getAlbumSongs, type Album } from "@/data/albums";
import { cn } from "@/lib/utils";

type AlbumCardProps = {
  album: Album;
  className?: string;
  compact?: boolean;
};

export function AlbumCard({ album, className, compact = false }: AlbumCardProps) {
  const { currentSong, isPlaying, playQueue, togglePlay } = usePlayer();
  const creator = getAlbumCreator(album);
  const albumSongs = getAlbumSongs(album);
  const trackCount = albumSongs.length;
  const isAlbumCurrent = albumSongs.some((song) => song.slug === currentSong?.slug);
  const isAlbumPlaying = isAlbumCurrent && isPlaying;

  const handlePlayAlbum = () => {
    if (isAlbumCurrent) {
      togglePlay();
      return;
    }
    playQueue(albumSongs, 0);
  };

  if (albumSongs.length === 0) {
    return null;
  }

  return (
    <article
      className={cn(
        "group rounded-[24px] border border-white/[0.08] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur-sm transition hover:-translate-y-1",
        isAlbumCurrent ? "bg-white/[0.12]" : "bg-white/[0.06] hover:bg-white/[0.1]",
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(180deg, ${album.palette.surfaceAlt} 0%, ${album.palette.surface} 100%)`,
        boxShadow: `0 18px 40px rgba(0,0,0,0.32), 0 0 0 1px ${album.palette.glow}`,
      }}
    >
      <div className="group relative">
        <Link href={`/albums/${album.slug}`} className="block">
          <div className="relative overflow-hidden rounded-[18px]">
            <CoverImage
              src={album.coverSrc}
              alt={`${album.title} cover`}
              className={cn(
                "aspect-square w-full shadow-lg transition duration-300 group-active:scale-[0.98] group-hover:scale-[1.02]",
                isAlbumCurrent && "ring-2 ring-offset-2 ring-offset-transparent",
              )}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 38%, rgba(5,8,12,0.72) 100%)`,
              }}
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
              <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white/90">
                {album.kind}
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-black"
                style={{ backgroundColor: album.palette.glow, color: album.palette.accent }}
              >
                {trackCount} {trackCount === 1 ? "track" : "tracks"}
              </span>
            </div>
            <div className="pointer-events-none absolute inset-x-3 bottom-3">
              <p className="truncate text-sm font-black text-white/95">{creator?.name ?? "Family"}</p>
            </div>
          </div>
        </Link>
        <PlayIconButton
          size="sm"
          playing={isAlbumPlaying}
          label={isAlbumPlaying ? `Pause ${album.title}` : `Play ${album.title}`}
          onClick={handlePlayAlbum}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        />
      </div>

      <div className="mt-3 min-w-0">
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/65">
          <span>{creator?.name ?? "Family"}</span>
          <span>•</span>
          <span>{album.releaseDate}</span>
        </div>
        <Link href={`/albums/${album.slug}`} className="mt-1 block min-w-0">
          <p
            className={cn(
              "truncate text-base font-black tracking-tight",
              isAlbumCurrent ? "text-[var(--family-pink)]" : "text-white",
            )}
          >
            {album.title}
          </p>
        </Link>
        <p
          className={cn(
            "mt-1 line-clamp-2 text-sm text-white/72",
            compact && "line-clamp-3 text-[13px]",
          )}
        >
          {album.subtitle}
        </p>
      </div>
    </article>
  );
}
