"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";

type SongRowProps = {
  song: Song;
  index?: number;
  showIndex?: boolean;
};

export function SongRow({ song, index, showIndex = false }: SongRowProps) {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const author = getMemberBySlug(song.authorSlug);
  const isActive = currentSong?.slug === song.slug && isPlaying;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.045] bg-white/[0.045] p-2 transition hover:bg-white/[0.08]">
      {showIndex && index !== undefined ? (
        <span className="w-5 shrink-0 text-center text-sm text-[var(--jb-muted)]">{index + 1}</span>
      ) : null}
      <button
        type="button"
        onClick={() => playSong(song)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label={`Play ${song.title}`}
      >
        <CoverImage src={song.coverSrc} alt="" className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <strong className={`block truncate text-sm ${isActive ? "text-[var(--family-pink)]" : ""}`}>
            {song.title}
          </strong>
          <span className="block truncate text-xs text-[var(--jb-muted)]">
            {author?.name} · {song.tags.slice(0, 3).join(" · ")}
          </span>
        </div>
      </button>
      <Link
        href={`/songs/${song.slug}`}
        className="shrink-0 px-2 text-xs text-[var(--jb-muted)] hover:text-white"
        aria-label={`Open ${song.title}`}
      >
        ···
      </Link>
    </div>
  );
}
