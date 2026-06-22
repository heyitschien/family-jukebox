"use client";

import Link from "next/link";

import { SongRow } from "@/components/song-row";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import { usePlayer } from "@/contexts/player-context";
import type { Song } from "@/data/songs";
import { filterSongsForAudience } from "@/lib/audience";

type SongShelfProps = {
  songs: Song[];
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  compact?: boolean;
};

export function SongShelf({
  songs,
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  compact = false,
}: SongShelfProps) {
  const { playQueue } = usePlayer();
  const { audienceId } = useFamilyAudienceContext();
  const visibleSongs = audienceId ? filterSongsForAudience(songs, audienceId) : songs;

  if (visibleSongs.length === 0) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {visibleSongs.length > 1 ? (
            <button
              type="button"
              onClick={() => playQueue(visibleSongs, 0, "shelf")}
              className="inline-flex min-h-11 items-center rounded-full bg-family-accent px-4 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
            >
              Play all
            </button>
          ) : null}
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="text-sm font-bold text-[var(--family-pink)] hover:underline"
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </div>
      </div>

      <div className={compact ? "grid gap-1" : "grid gap-2"}>
        {visibleSongs.map((song, index) => (
          <SongRow
            key={song.slug}
            song={song}
            index={index}
            showIndex={!compact}
            playlist={visibleSongs}
          />
        ))}
      </div>
    </section>
  );
}
