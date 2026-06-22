"use client";

import dynamic from "next/dynamic";

import type { Song } from "@/data/songs";

const RecentQueue = dynamic(
  () => import("@/components/recent-queue").then((mod) => mod.RecentQueue),
  {
    ssr: false,
    loading: () => (
      <section className="mt-4 min-h-[320px] animate-pulse rounded-[28px] border border-white/[0.07] bg-white/[0.04] lg:mt-6" />
    ),
  },
);

type HomeRecentQueueProps = {
  songs: Song[];
  familyQueue: Song[];
  spotlightSlugs: string[];
  listenerAge?: number | null;
};

export function HomeRecentQueue({ listenerAge, ...props }: HomeRecentQueueProps) {
  return <RecentQueue {...props} listenerAge={listenerAge} />;
}
