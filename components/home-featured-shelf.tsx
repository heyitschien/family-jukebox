"use client";

import dynamic from "next/dynamic";

import type { Song } from "@/data/songs";

const FeaturedShelf = dynamic(
  () => import("@/components/featured-shelf").then((mod) => mod.FeaturedShelf),
  {
    ssr: false,
    loading: () => (
      <section className="jb-float-panel mt-4 min-h-[280px] animate-pulse lg:mt-6" />
    ),
  },
);

type HomeFeaturedShelfProps = {
  songs: Song[];
  tags: string[];
  listenerAge?: number | null;
};

export function HomeFeaturedShelf({ listenerAge, ...props }: HomeFeaturedShelfProps) {
  return <FeaturedShelf {...props} listenerAge={listenerAge} />;
}
