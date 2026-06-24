"use client";

import Link from "next/link";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { SongFavoriteButton } from "@/components/song-favorite-button";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import type { QueueContext } from "@/lib/queue-context";
import { cn } from "@/lib/utils";

type FavoriteSongRowProps = {
  song: Song;
  index: number;
  playlist: Song[];
  queueContext: QueueContext;
};

export function FavoriteSongRow({ song, index, playlist, queueContext }: FavoriteSongRowProps) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, {
    playlist,
    source: "shelf",
    queueContext,
  });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 border-b border-white/[0.06] py-2 pl-1 pr-0.5 last:border-b-0",
        isCurrent && "bg-white/[0.04]",
      )}
    >
      <span className="w-5 shrink-0 text-center text-[11px] tabular-nums text-[var(--jb-muted-2)]">
        {index + 1}
      </span>

      <PlayIconButton
        size="sm"
        playing={playing}
        label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
        onClick={toggle}
        className="shrink-0"
      />

      <Link
        href={`/songs/${song.slug}`}
        className="flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden"
      >
        <CoverImage
          src={song.coverSrc}
          alt=""
          className="size-10 shrink-0 rounded-[10px] shadow-[0_4px_14px_rgba(0,0,0,0.28)] ring-1 ring-white/10"
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <strong
            className={cn(
              "block truncate text-[14px] font-semibold leading-tight",
              isCurrent && "text-[var(--family-pink)]",
            )}
          >
            {song.title}
          </strong>
          <span className="mt-0.5 block truncate text-[12px] text-[var(--jb-muted)]">
            {author?.name ?? "Family"}
          </span>
        </div>
      </Link>

      <SongFavoriteButton songSlug={song.slug} songTitle={song.title} size="sm" />
    </div>
  );
}
