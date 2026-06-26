"use client";

import { HomeSongStrip } from "@/components/home-song-strip";
import { getMemberBySlug } from "@/data/members";
import type { Song } from "@/data/songs";
import { getListenerCurationSubtitle } from "@/lib/audience";

type HomeFamilyPicksProps = {
  songs: Song[];
  listenerAge?: number | null;
};

export function HomeFamilyPicks({ songs, listenerAge = null }: HomeFamilyPicksProps) {
  if (songs.length === 0) return null;

  return (
    <section className="jb-float-panel mt-4 p-4 sm:p-[22px] lg:mt-6">
      <div className="mb-4">
        <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">
          {listenerAge !== null ? `Today's picks for age ${listenerAge}` : "Today's family picks"}
        </h2>
        <p className="text-sm font-bold text-[var(--jb-muted)]">
          {listenerAge !== null
            ? getListenerCurationSubtitle(listenerAge)
            : "One spotlight song per cousin — who should you hear from today?"}
        </p>
      </div>
      <HomeSongStrip
        songs={songs}
        pickLabel={(song) => {
          const author = getMemberBySlug(song.authorSlug);
          return author ? `Today's pick from ${author.name}` : undefined;
        }}
      />
    </section>
  );
}
