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
  supplementarySeries: Album[];
  shelfSongs: Song[];
  familyQueue: Song[];
  spotlightSlugs: string[];
  tags: string[];
};

export function HomeCuratedContent({
  refreshSeed,
  featuredAlbum,
  carouselAlbums,
  supplementarySeries,
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
        shelfSongs,
        familyQueue,
        featuredAlbum,
      };
    }

    return {
      carouselAlbums: curateAlbumsForListener(carouselAlbums, listenerAge),
      shelfSongs: curateSongsForListener(shelfSongs, listenerAge),
      familyQueue: curateSongsForListener(familyQueue, listenerAge),
      featuredAlbum: curateAlbumsForListener(carouselAlbums, listenerAge)[0] ?? featuredAlbum,
    };
  }, [carouselAlbums, familyQueue, featuredAlbum, listenerAge, shelfSongs]);

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
      {supplementarySeries.length > 0 ? (
        <HomeAlbumShelf
          albums={supplementarySeries}
          title="Growing series"
          subtitle="Themed albums gaining new singles — not in the hero ring yet"
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
