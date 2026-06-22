"use client";

import dynamic from "next/dynamic";

import type { Album } from "@/data/albums";

const AlbumCarousel3D = dynamic(
  () => import("@/components/album-carousel-3d").then((mod) => mod.AlbumCarousel3D),
  {
    ssr: false,
    loading: () => (
      <section className="relative -mx-3 min-h-[420px] animate-pulse rounded-b-[34px] bg-white/[0.04] sm:mx-0 sm:rounded-[32px]" />
    ),
  },
);

type HomeHeroCarouselProps = {
  albums: Album[];
  featuredAlbum: Album;
  refreshSeed: number;
  showTopbar?: boolean;
};

export function HomeHeroCarousel(props: HomeHeroCarouselProps) {
  return <AlbumCarousel3D {...props} />;
}
