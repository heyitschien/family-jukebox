"use client";

import { useEffect, useState } from "react";

import { getSongBySlug } from "@/data/songs";

type SiteStats = {
  totalPlays: number;
  totalCompletes: number;
  uniqueListeners: number;
  topSongs: Array<{
    songSlug: string;
    playCount: number;
    completeCount: number;
    uniqueListeners: number;
  }>;
};

export function JukeboxStatsCard() {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/stats")
      .then((response) => response.json())
      .then((payload: { ok: boolean; stats?: SiteStats }) => {
        if (!cancelled && payload.ok && payload.stats && payload.stats.totalPlays > 0) {
          setStats(payload.stats);
        }
      })
      .catch(() => {
        // Stats are optional UI sugar — ignore failures.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-4 rounded-[18px] border border-white/[0.08] bg-black/20 p-3.5">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--jb-muted)]">
        Family listening
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-family-accent px-3 py-1.5 text-[12px] font-black text-[#1a0812]">
          {stats.totalPlays} plays
        </span>
        <span className="rounded-full border border-white/[0.09] bg-white/[0.07] px-3 py-1.5 text-[12px] font-extrabold text-[var(--family-pink)]">
          {stats.uniqueListeners} listeners
        </span>
      </div>
      {stats.topSongs.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-left text-[13px] text-[var(--jb-muted)]">
          {stats.topSongs.map((row) => {
            const song = getSongBySlug(row.songSlug);
            return (
              <li key={row.songSlug} className="flex items-center justify-between gap-3">
                <span className="truncate">{song?.title ?? row.songSlug}</span>
                <span className="shrink-0 font-bold text-[var(--jb-text)]">{row.playCount}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
