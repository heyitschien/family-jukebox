"use client";

import { useMemo } from "react";

import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import { curateAlbumsForListener, curateSongsForListener } from "@/lib/audience";

type HomeCuratedContentProps = {
  refreshSeed: number;
  featuredAlbum: Album;
  carouselAlbums: Album[];
  growingSeriesAlbums: Album[];
  shelfSongs: Song[];
  familyQueue: Song[];
  spotlightSlugs: string[];
  tags: string[];
};

export function HomeCuratedContent({
  refreshSeed,
  featuredAlbum,
  carouselAlbums,
  growingSeriesAlbums,
  shelfSongs,
  familyQueue,
  spotlightSlugs,
  tags,
}: HomeCuratedContentProps) {
  const { listenerAge } = useListenerAgeContext();

  const curated = useMemo(() => {
    if (listenerAge === null) {
      return {
        carouselAlbums,
        growingSeriesAlbums,
        shelfSongs,
        familyQueue,
        featuredAlbum,
      };
    }

    return {
      carouselAlbums: curateAlbumsForListener(carouselAlbums, listenerAge),
      growingSeriesAlbums: curateAlbumsForListener(growingSeriesAlbums, listenerAge),
      shelfSongs: curateSongsForListener(shelfSongs, listenerAge),
      familyQueue: curateSongsForListener(familyQueue, listenerAge),
      featuredAlbum: curateAlbumsForListener(carouselAlbums, listenerAge)[0] ?? featuredAlbum,
    };
  }, [carouselAlbums, familyQueue, featuredAlbum, growingSeriesAlbums, listenerAge, shelfSongs]);

  return (
    <>
      <HomeHeroCarousel
        albums={curated.carouselAlbums}
        featuredAlbum={curated.featuredAlbum}
        refreshSeed={refreshSeed}
      />
      <HomeAlbumShelf
        albums={curated.carouselAlbums}
        subtitle="One album per family member — tap to explore or play"
      />
      {curated.growingSeriesAlbums.length > 0 ? (
        <HomeAlbumShelf
          albums={curated.growingSeriesAlbums}
          title="Growing series"
          subtitle="Every cousin's growing albums — themed releases that gain new singles over time"
          showViewAll
        />
      ) : null}
      <HomeFeaturedShelf songs={curated.shelfSongs} tags={tags} listenerAge={listenerAge} />
      <HomeRecentQueue
        songs={curated.shelfSongs}
        familyQueue={curated.familyQueue}
        spotlightSlugs={spotlightSlugs}
        listenerAge={listenerAge}
      />
    </>
  );
}
