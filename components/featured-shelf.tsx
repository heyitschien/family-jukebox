"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { useSongPlayback } from "@/hooks/use-song-playback";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type FeaturedShelfProps = {
  songs: Song[];
  tags: string[];
};

function FeaturedAlbumCard({ song, playlist }: { song: Song; playlist: Song[] }) {
  const { playing, toggle, isCurrent } = useSongPlayback(song, { playlist });
  const author = getMemberBySlug(song.authorSlug);

  return (
    <article
      className={cn(
        "group relative min-w-0 rounded-[20px] border p-2.5 transition hover:-translate-y-0.5 sm:rounded-[22px] sm:p-3",
        isCurrent
          ? "border-[rgba(255,111,177,0.35)] bg-white/[0.09]"
          : "border-white/[0.06] bg-white/[0.055] hover:bg-white/[0.09]",
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gradient-to-br from-[#314155] to-[#14202c] shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
        <CoverImage src={song.coverSrc} alt="" className="size-full" />
        <PlayIconButton
          size="sm"
          playing={playing}
          label={playing ? `Pause ${song.title}` : `Play ${song.title}`}
          onClick={toggle}
          className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        />
      </div>
      <Link href={`/songs/${song.slug}`} className="mt-3 block min-w-0">
        <h3
          className={cn(
            "truncate text-sm font-bold tracking-tight sm:text-[15px]",
            isCurrent && "text-[var(--family-pink)]",
          )}
        >
          {song.title}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[35px] text-xs leading-snug text-[var(--jb-muted)] sm:text-[13px]">
          {song.subtitle ?? `${author?.name ?? "Family"} · family song`}
        </p>
      </Link>
    </article>
  );
}

export function FeaturedShelf({ songs, tags }: FeaturedShelfProps) {
  const { playQueue } = usePlayer();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeTag) return songs;
    return songs.filter((s) => s.tags.includes(activeTag));
  }, [activeTag, songs]);

  const chips = ["All", ...tags.slice(0, 8)];

  return (
    <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] p-4 sm:p-[22px] lg:mt-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Featured family songs</h2>
          <p className="text-sm font-bold text-[var(--jb-muted)]">
            Start anywhere in this shelf and the queue keeps the music moving for you.
          </p>
        </div>
        {filtered.length > 1 ? (
          <button
            type="button"
            onClick={() => playQueue(filtered, 0)}
            className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-family-accent px-4 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
          >
            Play all
          </button>
        ) : null}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {chips.map((chip) => {
          const isAll = chip === "All";
          const active = isAll ? activeTag === null : activeTag === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveTag(isAll ? null : chip)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-extrabold whitespace-nowrap transition",
                active
                  ? "border-transparent bg-family-accent text-[#1a0812]"
                  : "border-white/[0.09] bg-white/[0.07] text-[var(--jb-muted)] hover:text-[var(--jb-text)]",
              )}
            >
              {chip}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-4 xl:grid-cols-6">
        {filtered.map((song) => (
          <FeaturedAlbumCard key={song.slug} song={song} playlist={filtered} />
        ))}
      </div>
    </section>
  );
}
