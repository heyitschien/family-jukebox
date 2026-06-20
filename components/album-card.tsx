"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";

type AlbumCardProps = {
  song: Song;
  subtitle?: string;
};

export function AlbumCard({ song, subtitle }: AlbumCardProps) {
  const { playSong } = usePlayer();

  return (
    <div className="w-36 shrink-0 snap-start sm:w-40">
      <button
        type="button"
        onClick={() => playSong(song)}
        className="group w-full text-left"
        aria-label={`Play ${song.title}`}
      >
        <CoverImage
          src={song.coverSrc}
          alt=""
          className="aspect-square w-full rounded-md shadow-lg transition group-active:scale-[0.98]"
        />
      </button>
      <Link href={`/songs/${song.slug}`} className="mt-3 block min-w-0">
        <p className="truncate text-sm font-bold text-white hover:underline">{song.title}</p>
        <p className="mt-0.5 truncate text-xs text-[#b3b3b3]">{subtitle ?? "Family song"}</p>
      </Link>
    </div>
  );
}
