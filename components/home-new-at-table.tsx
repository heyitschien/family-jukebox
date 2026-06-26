"use client";

import { HomeSongStrip } from "@/components/home-song-strip";
import type { Song } from "@/data/songs";

type HomeNewAtTheTableProps = {
  songs: Song[];
};

export function HomeNewAtTheTable({ songs }: HomeNewAtTheTableProps) {
  if (songs.length === 0) return null;

  return (
    <section className="jb-float-panel mt-4 p-4 sm:p-[22px] lg:mt-6">
      <div className="mb-4">
        <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">New at the table</h2>
        <p className="text-sm font-bold text-[var(--jb-muted)]">
          What&apos;s new in the family — fresh drops and celebration moments
        </p>
      </div>
      <HomeSongStrip songs={songs} />
    </section>
  );
}
