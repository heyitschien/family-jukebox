"use client";

import dynamic from "next/dynamic";

import type { Song } from "@/data/songs";
import type { FamilyAudienceId } from "@/lib/audience";

const FeaturedShelf = dynamic(
  () => import("@/components/featured-shelf").then((mod) => mod.FeaturedShelf),
  {
    ssr: false,
    loading: () => (
      <section className="mt-4 min-h-[280px] animate-pulse rounded-[28px] border border-white/[0.07] bg-white/[0.04] lg:mt-6" />
    ),
  },
);

type HomeFeaturedShelfProps = {
  songs: Song[];
  tags: string[];
  audienceId?: FamilyAudienceId | null;
};

export function HomeFeaturedShelf({ audienceId, ...props }: HomeFeaturedShelfProps) {
  return <FeaturedShelf {...props} audienceId={audienceId} />;
}
