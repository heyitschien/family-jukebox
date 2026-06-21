"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  playlist?: Song[];
};

export function SongRow({ song, index, showIndex = false, playlist }: SongRowProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full items-center gap-3 rounded-2xl border p-2 transition hover:bg-white/[0.08]",
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
      <Link href={`/songs/${song.slug}`} className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
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
            {author ? `${author.name} · ` : ""}
            {song.tags.slice(0, 3).join(" · ")}
          </span>
        </div>
      </Link>
      <Link
        href={`/songs/${song.slug}`}
        className="inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center rounded-full text-[var(--jb-muted)] transition hover:bg-white/[0.07] hover:text-white"
        aria-label={`Open ${song.title}`}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
