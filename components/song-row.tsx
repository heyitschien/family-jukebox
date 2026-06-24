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

type SongRowProps = {
  song: Song;
  index?: number;
  showIndex?: boolean;
  playlist?: Song[];
};

function buildRowSubtitle(song: Song, authorName?: string): string {
  const tags = song.tags.slice(0, 2);
  return [authorName, ...tags].filter(Boolean).join(" · ");
}

export function SongRow({ song, index, showIndex = false, playlist }: SongRowProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist, source: "shelf" });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 overflow-hidden rounded-2xl border p-2 transition hover:bg-white/[0.08] sm:gap-3",
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
      <Link
        href={`/songs/${song.slug}`}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3"
      >
        <CoverImage src={song.coverSrc} alt="" className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex min-w-0 items-center gap-2">
            <strong
              className={cn(
                "min-w-0 truncate text-sm",
                isCurrent && "text-[var(--family-pink)]",
              )}
            >
              {song.title}
            </strong>
            <NewReleaseBadge song={song} />
          </div>
          <span className="block truncate text-xs text-[var(--jb-muted)]">
            {buildRowSubtitle(song, author?.name)}
          </span>
        </div>
        <ChevronRight
          className="size-4 shrink-0 text-[var(--jb-muted)]"
          aria-hidden
        />
      </Link>
      <SongFavoriteButton songSlug={song.slug} songTitle={song.title} size="sm" />
    </div>
  );
}
