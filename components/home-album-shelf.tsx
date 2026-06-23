"use client";

import dynamic from "next/dynamic";

import type { Album } from "@/data/albums";

const AlbumShelf = dynamic(
  () => import("@/components/album-shelf").then((mod) => mod.AlbumShelf),
  {
    ssr: false,
    loading: () => (
      <section className="jb-float-panel mt-4 min-h-[220px] animate-pulse lg:mt-6" />
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
