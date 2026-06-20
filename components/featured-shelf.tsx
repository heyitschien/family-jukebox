"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CoverImage } from "@/components/cover-image";
import { PlayIconButton } from "@/components/play-icon-button";
import { usePlayer } from "@/contexts/player-context";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type FeaturedShelfProps = {
  songs: Song[];
  tags: string[];
};

export function FeaturedShelf({ songs, tags }: FeaturedShelfProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { playSong } = usePlayer();

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
            Compressed Spotify-style shelf instead of a long scroll.
          </p>
        </div>
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
        {filtered.map((song) => {
          const author = getMemberBySlug(song.authorSlug);
          return (
            <article
              key={song.slug}
              className="group relative min-w-0 rounded-[20px] border border-white/[0.06] bg-white/[0.055] p-2.5 transition hover:-translate-y-0.5 hover:bg-white/[0.09] sm:rounded-[22px] sm:p-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-gradient-to-br from-[#314155] to-[#14202c] shadow-[0_16px_30px_rgba(0,0,0,0.22)]">
                <CoverImage src={song.coverSrc} alt="" className="size-full" />
                <PlayIconButton
                  size="sm"
                  label={`Play ${song.title}`}
                  onClick={() => playSong(song)}
                  className="absolute right-2 bottom-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                />
              </div>
              <Link href={`/songs/${song.slug}`} className="mt-3 block min-w-0">
                <h3 className="truncate text-sm font-bold tracking-tight sm:text-[15px]">{song.title}</h3>
                <p className="mt-1 line-clamp-2 min-h-[35px] text-xs leading-snug text-[var(--jb-muted)] sm:text-[13px]">
                  {song.subtitle ?? `${author?.name ?? "Family"} · family song`}
                </p>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
