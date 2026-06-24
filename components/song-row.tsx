"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { CoverImage } from "@/components/cover-image";
import { NewReleaseBadge } from "@/components/new-release-badge";
import { PlayIconButton } from "@/components/play-icon-button";
import { SongFavoriteButton } from "@/components/song-favorite-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

import type { QueueContext } from "@/lib/queue-context";

type SongRowProps = {
  song: Song;
  index?: number;
  showIndex?: boolean;
  playlist?: Song[];
  compact?: boolean;
  showChevron?: boolean;
  queueContext?: QueueContext;
};

function buildRowSubtitle(song: Song, authorName?: string): string {
  const tags = song.tags.slice(0, 2);
  return [authorName, ...tags].filter(Boolean).join(" · ");
}

export function SongRow({
  song,
  index,
  showIndex = false,
  playlist,
  compact = false,
  showChevron = true,
  queueContext,
}: SongRowProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, {
    playlist,
    source: "shelf",
    queueContext,
  });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "group flex min-w-0 items-center overflow-hidden transition",
        compact
          ? "gap-2 rounded-xl px-2 py-1.5 hover:bg-white/[0.06]"
          : "gap-2 rounded-2xl border p-2 hover:bg-white/[0.08] sm:gap-3",
        !compact &&
          (isCurrent
            ? "border-[rgba(255,111,177,0.35)] bg-white/[0.07]"
            : "border-white/[0.045] bg-white/[0.045]"),
        compact && isCurrent && "bg-white/[0.06]",
      )}
    >
      {showIndex && index !== undefined ? (
        <span
          className={cn(
            "w-5 shrink-0 text-center tabular-nums",
            compact ? "text-xs text-[var(--jb-muted-2)]" : "text-sm text-[var(--jb-muted)]",
            isCurrent && "font-bold text-[var(--cr-pink)]",
          )}
        >
          {index + 1}
        </span>
      ) : null}
      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
        className={cn(compact && "size-9 min-h-9 min-w-9 opacity-90 sm:opacity-100")}
      />
      <Link
        href={`/songs/${song.slug}`}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3"
      >
        <CoverImage
          src={song.coverSrc}
          alt=""
          className={cn("shrink-0 rounded-lg", compact ? "size-9" : "size-11 rounded-xl")}
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <strong
              className={cn(
                "min-w-0 truncate",
                compact ? "text-[13px] font-semibold" : "text-sm",
                isCurrent && "text-[var(--cr-pink)]",
              )}
            >
              {song.title}
            </strong>
            {!compact ? <NewReleaseBadge song={song} /> : null}
          </div>
          <span
            className={cn(
              "block truncate text-[var(--jb-muted)]",
              compact ? "text-[11px]" : "text-xs",
            )}
          >
            {buildRowSubtitle(song, author?.name)}
          </span>
        </div>
        {showChevron ? (
          <ChevronRight className="size-4 shrink-0 text-[var(--jb-muted)]" aria-hidden />
        ) : null}
      </Link>
      <SongFavoriteButton songSlug={song.slug} songTitle={song.title} size="sm" />
    </div>
  );
}
