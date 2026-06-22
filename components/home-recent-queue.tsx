"use client";

import dynamic from "next/dynamic";

import type { Song } from "@/data/songs";
import type { FamilyAudienceId } from "@/lib/audience";

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
  audienceId?: FamilyAudienceId | null;
};

export function HomeRecentQueue({ audienceId, ...props }: HomeRecentQueueProps) {
  return <RecentQueue {...props} audienceId={audienceId} />;
}
