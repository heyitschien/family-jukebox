"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getAlbumAuthor, getAlbumSongs, type Album } from "@/data/albums";
import { songs } from "@/data/songs";
import { cn } from "@/lib/utils";

type AlbumCardProps = {
  album: Album;
  className?: string;
  size?: "sm" | "md";
};

export function AlbumCard({ album, className, size = "md" }: AlbumCardProps) {
  const { playQueue, currentSong, isPlaying, queue } = usePlayer();
  const albumSongs = getAlbumSongs(album);
  const author = getAlbumAuthor(album);
  const firstSong = albumSongs[0];

  const isAlbumPlaying =
    !!firstSong &&
    isPlaying &&
    albumSongs.some((s) => s.slug === currentSong?.slug) &&
    queue.length === albumSongs.length &&
    queue.every((q, i) => albumSongs[i]?.slug === q.slug);

  const { toggle } = useSongPlayback(firstSong ?? songs[0], {
    playlist: albumSongs.length > 0 ? albumSongs : undefined,
  });

  if (!firstSong) return null;

  const handlePlay = () => {
    if (isAlbumPlaying) {
      toggle();
      return;
    }
    playQueue(albumSongs, 0);
  };

  const widthClass = size === "sm" ? "w-32" : "w-40 sm:w-44";

  return (
    <div className={cn("shrink-0", widthClass, className)}>
      <div className="group relative">
        <Link href={`/albums/${album.slug}`} className="block">
          <div
            className="overflow-hidden rounded-xl"
            style={{ boxShadow: `0 12px 32px ${album.accentColor}33` }}
          >
            <CoverImage
              src={album.coverSrc}
              alt=""
              className={cn(
                "aspect-square w-full shadow-lg transition group-active:scale-[0.98]",
                isAlbumPlaying && "ring-2 ring-[var(--family-pink)]",
              )}
            />
          </div>
        </Link>
        <PlayIconButton
          size="sm"
          playing={isAlbumPlaying}
          label={isAlbumPlaying ? `Pause ${album.title}` : `Play ${album.title}`}
          onClick={handlePlay}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>
      <Link href={`/albums/${album.slug}`} className="mt-3 block min-w-0">
        <p
          className={cn(
            "truncate text-sm font-bold hover:underline",
            isAlbumPlaying ? "text-[var(--family-pink)]" : "text-white",
          )}
        >
          {album.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[var(--jb-muted)]">
          {author?.name ?? "Family"} · {albumSongs.length}{" "}
          {albumSongs.length === 1 ? "track" : "tracks"}
        </p>
      </Link>
    </div>
  );
}
