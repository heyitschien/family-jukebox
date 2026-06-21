"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import type { Album } from "@/lib/albums";
import { cn } from "@/lib/utils";

type AlbumCardProps = {
  album: Album;
  className?: string;
};

export function AlbumCard({ album, className }: AlbumCardProps) {
  const { currentSong, isPlaying, playQueue, togglePlay } = usePlayer();
  const isCurrent = currentSong?.authorSlug === album.memberSlug;
  const playing = isCurrent && isPlaying;
  const hasSongs = album.songs.length > 0;

  const toggleAlbum = () => {
    if (!hasSongs) return;
    if (isCurrent) {
      togglePlay();
      return;
    }
    playQueue(album.songs, 0);
  };

  return (
    <article className={cn("w-[168px] shrink-0 snap-start sm:w-[188px]", className)}>
      <div className="group relative">
        <Link href={`/members/${album.slug}`} aria-label={`Open ${album.title}`}>
          <div
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-[22px] border shadow-[0_18px_38px_rgba(0,0,0,0.3)] transition group-active:scale-[0.98]",
              isCurrent ? "border-[rgba(255,111,177,0.55)]" : "border-white/[0.08]",
            )}
            style={{ boxShadow: isCurrent ? `0 18px 46px ${album.glow}` : undefined }}
          >
            {album.coverSrc ? (
              <CoverImage src={album.coverSrc} alt="" className="size-full" />
            ) : (
              <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#2a3545] to-[#121820] text-5xl">
                {album.member.emoji}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-white/10" />
            <div className="absolute right-3 bottom-3 left-3">
              <p className="truncate text-xs font-black tracking-[0.16em] text-white/70 uppercase">
                {album.member.name}
              </p>
              <h3 className="mt-1 line-clamp-2 text-lg leading-tight font-black tracking-tight text-white">
                {album.title}
              </h3>
            </div>
          </div>
        </Link>
        <PlayIconButton
          size="sm"
          variant={isCurrent ? "light" : "accent"}
          playing={playing}
          label={playing ? `Pause ${album.title}` : `Play ${album.title}`}
          onClick={toggleAlbum}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        />
      </div>
      <Link href={`/members/${album.slug}`} className="mt-3 block min-w-0">
        <p
          className={cn(
            "truncate text-sm font-bold hover:underline",
            isCurrent ? "text-[var(--family-pink)]" : "text-white",
          )}
        >
          {album.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#b3b3b3]">
          {album.trackCount} {album.trackCount === 1 ? "song" : "songs"} · {album.subtitle}
        </p>
      </Link>
    </article>
  );
}
