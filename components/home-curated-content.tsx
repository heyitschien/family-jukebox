"use client";

import { useMemo } from "react";

import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import {
  curateAlbumsForAudience,
  curateAlbumsForListener,
  curateSongsForAudience,
  curateSongsForListener,
  filterAlbumsForAudience,
  filterSongsForAudience,
  getVisibleTagsForAudience,
} from "@/lib/audience";

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
  const { audienceId, listenerAge } = useFamilyAudienceContext();

  const curated = useMemo(() => {
    if (listenerAge === null || audienceId === null) {
      return {
        carouselAlbums,
        supplementarySeries,
        shelfSongs,
        familyQueue,
        featuredAlbum,
        tags,
      };
    }

    const visibleCarouselAlbums = filterAlbumsForAudience(carouselAlbums, audienceId);
    const visibleSupplementarySeries = filterAlbumsForAudience(supplementarySeries, audienceId);
    const visibleShelfSongs = filterSongsForAudience(shelfSongs, audienceId);
    const visibleFamilyQueue = filterSongsForAudience(familyQueue, audienceId);
    const fallbackCarousel = visibleCarouselAlbums.length > 0 ? visibleCarouselAlbums : carouselAlbums;
    const fallbackShelfSongs = visibleShelfSongs.length > 0 ? visibleShelfSongs : shelfSongs;
    const fallbackQueue = visibleFamilyQueue.length > 0 ? visibleFamilyQueue : familyQueue;

    return {
      carouselAlbums:
        fallbackCarousel.length > 0
          ? curateAlbumsForAudience(fallbackCarousel, audienceId)
          : curateAlbumsForListener(carouselAlbums, listenerAge),
      supplementarySeries: visibleSupplementarySeries,
      shelfSongs:
        fallbackShelfSongs.length > 0
          ? curateSongsForAudience(fallbackShelfSongs, audienceId)
          : curateSongsForListener(shelfSongs, listenerAge),
      familyQueue:
        fallbackQueue.length > 0
          ? curateSongsForAudience(fallbackQueue, audienceId)
          : curateSongsForListener(familyQueue, listenerAge),
      featuredAlbum:
        curateAlbumsForAudience(fallbackCarousel, audienceId)[0] ??
        curateAlbumsForListener(carouselAlbums, listenerAge)[0] ??
        featuredAlbum,
      tags:
        fallbackShelfSongs.length > 0 ? getVisibleTagsForAudience(fallbackShelfSongs, audienceId) : tags,
    };
  }, [
    audienceId,
    carouselAlbums,
    familyQueue,
    featuredAlbum,
    listenerAge,
    shelfSongs,
    supplementarySeries,
    tags,
  ]);

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
      {curated.supplementarySeries.length > 0 ? (
        <HomeAlbumShelf
          albums={curated.supplementarySeries}
          title="Growing series"
          subtitle="Themed albums gaining new singles — not in the hero ring yet"
          showViewAll
        />
      ) : null}
      <HomeFeaturedShelf songs={curated.shelfSongs} tags={curated.tags} />
      <HomeRecentQueue
        songs={curated.shelfSongs}
        familyQueue={curated.familyQueue}
        spotlightSlugs={spotlightSlugs}
      />
    </>
  );
}
