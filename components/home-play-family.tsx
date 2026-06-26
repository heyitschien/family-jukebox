"use client";

import Link from "next/link";

import { JukeboxStatsCard } from "@/components/jukebox-stats-card";
import { usePlayer } from "@/contexts/player-context";
import { members } from "@/data/members";
import type { Song } from "@/data/songs";
import { songs as allSongs } from "@/data/songs";
import { getListenerCurationSubtitle } from "@/lib/audience";

type HomePlayFamilyProps = {
  familyQueue: Song[];
  listenerAge?: number | null;
};

export function HomePlayFamily({ familyQueue, listenerAge = null }: HomePlayFamilyProps) {
  const { playQueue } = usePlayer();
  const videoCount = allSongs.filter((song) => song.videoSrc).length;

  return (
    <section className="jb-float-panel mt-4 p-4 sm:p-[22px] lg:mt-6">
      <div className="rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-white/[0.11] to-white/[0.04] p-4 sm:p-5">
        <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">
          {listenerAge !== null ? "Keep the table going" : "Play the family"}
        </h2>
        <p className="mt-2 text-sm font-bold text-[var(--jb-muted)]">
          {listenerAge !== null
            ? getListenerCurationSubtitle(listenerAge)
            : "One button for everyone — fair rotation across the whole family mix."}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--jb-muted)]">
          Playful, colorful, memory-first — who made it, what inspired it, and why it still makes us
          laugh.
        </p>
        <div className="mt-3.5 flex flex-wrap gap-2">
          <span className="rounded-full bg-family-accent px-3 py-2 text-[13px] font-extrabold text-[#1a0812]">
            {allSongs.length} songs
          </span>
          <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-2 text-[13px] font-extrabold text-[var(--family-ocean)]">
            {videoCount} videos
          </span>
          <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-2 text-[13px] font-extrabold text-[var(--family-pink)]">
            {members.length} artists
          </span>
        </div>
        <button
          type="button"
          onClick={() => playQueue(familyQueue, 0, "queue")}
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-family-accent px-5 py-2.5 text-sm font-black text-[#1a0812] [-webkit-tap-highlight-color:transparent]"
        >
          {listenerAge !== null ? "Play your family mix" : "Play the family mix"}
        </button>
        <JukeboxStatsCard />
        <Link
          href="/family"
          className="mt-3 inline-block text-sm font-bold text-family-glow hover:underline"
        >
          Meet the family →
        </Link>
      </div>
    </section>
  );
}
