"use client";

import dynamic from "next/dynamic";

import type { Album } from "@/data/albums";

const AlbumShelf = dynamic(
  () => import("@/components/album-shelf").then((mod) => mod.AlbumShelf),
  {
    ssr: false,
    loading: () => (
      <section className="mt-4 min-h-[220px] animate-pulse rounded-[28px] border border-white/[0.07] bg-white/[0.04] lg:mt-6" />
    ),
  },
);

type HomeAlbumShelfProps = {
  albums: Album[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
};

export function HomeAlbumShelf(props: HomeAlbumShelfProps) {
  return <AlbumShelf {...props} />;
}
