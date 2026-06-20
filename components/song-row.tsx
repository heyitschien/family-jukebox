"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type SongRowProps = {
  song: Song;
  index?: number;
  showIndex?: boolean;
};

export function SongRow({ song, index, showIndex = false }: SongRowProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song);
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-2 transition hover:bg-white/[0.08]",
        isCurrent
          ? "border-[rgba(255,111,177,0.35)] bg-white/[0.07]"
          : "border-white/[0.045] bg-white/[0.045]",
      )}
    >
      {showIndex && index !== undefined ? (
        <span className="w-5 shrink-0 text-center text-sm text-[var(--jb-muted)]">{index + 1}</span>
      ) : null}
      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
      />
      <Link href={`/songs/${song.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
        <CoverImage src={song.coverSrc} alt="" className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1">
          <strong
            className={cn(
              "block truncate text-sm",
              isCurrent && "text-[var(--family-pink)]",
            )}
          >
            {song.title}
          </strong>
          <span className="block truncate text-xs text-[var(--jb-muted)]">
            {author?.name} · {song.tags.slice(0, 3).join(" · ")}
          </span>
        </div>
      </Link>
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
