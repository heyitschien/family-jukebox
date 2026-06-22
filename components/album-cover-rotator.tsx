"use client";

import { useEffect, useState } from "react";

import { CoverImage } from "@/components/cover-image";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

const SONG_ROTATE_MS = 4500;

type AlbumCoverRotatorProps = {
  album: Album;
  songs: Song[];
  initialSongIndex: number;
  isFront: boolean;
  isPaused: boolean;
  className?: string;
};

export function AlbumCoverRotator({
  album,
  songs,
  initialSongIndex,
  isFront,
  isPaused,
  className,
}: AlbumCoverRotatorProps) {
  const [rotateIndex, setRotateIndex] = useState(0);
  const canRotate = songs.length > 1;
  const songIndex = isFront ? rotateIndex % songs.length : initialSongIndex;

  useEffect(() => {
    if (!isFront || !canRotate || isPaused) return;
    const timer = setInterval(() => {
      setRotateIndex((current) => (current + 1) % songs.length);
    }, SONG_ROTATE_MS);
    return () => clearInterval(timer);
  }, [canRotate, isFront, isPaused, songs.length]);

  if (songs.length === 0) {
    return <CoverImage src={album.coverSrc} alt="" className={cn("size-full", className)} />;
  }

  const activeSong = songs[songIndex] ?? songs[0];

  if (!canRotate) {
    return (
      <CoverImage
        src={activeSong?.coverSrc ?? album.coverSrc}
        alt=""
        className={cn("size-full", className)}
      />
    );
  }

  return (
    <div className={cn("relative size-full", className)}>
      {songs.map((song, index) => (
        <CoverImage
          key={song.slug}
          src={song.coverSrc}
          alt=""
          className={cn(
            "absolute inset-0 size-full transition-opacity duration-700",
            index === songIndex ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {isFront ? (
        <div className="absolute top-2 right-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-full border border-white/20 bg-black/55 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white/90 backdrop-blur-sm">
          {songIndex === 0 ? "Latest" : activeSong?.title}
        </div>
      ) : null}
    </div>
  );
}

export function getPlayStartIndex(albumSongs: Song[], displaySong: Song | undefined): number {
  if (!displaySong) return 0;
  const index = albumSongs.findIndex((song) => song.slug === displaySong.slug);
  return index >= 0 ? index : 0;
}
