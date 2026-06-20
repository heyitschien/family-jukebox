"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type AlbumCardProps = {
  song: Song;
  subtitle?: string;
};

export function AlbumCard({ song, subtitle }: AlbumCardProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song);

  return (
    <div className="w-36 shrink-0 snap-start sm:w-40">
      <div className="group relative">
        <CoverImage
          src={song.coverSrc}
          alt=""
          className={cn(
            "aspect-square w-full rounded-md shadow-lg transition group-active:scale-[0.98]",
            isCurrent && "ring-2 ring-[var(--family-pink)]",
          )}
        />
        <PlayIconButton
          size="sm"
          playing={playing}
          label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          onClick={toggle}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        />
      </div>
      <Link href={`/songs/${song.slug}`} className="mt-3 block min-w-0">
        <p
          className={cn(
            "truncate text-sm font-bold hover:underline",
            isCurrent ? "text-[var(--family-pink)]" : "text-white",
          )}
        >
          {song.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-[#b3b3b3]">{subtitle ?? "Family song"}</p>
      </Link>
    </div>
  );
}
