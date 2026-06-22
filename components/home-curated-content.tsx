"use client";

import { useMemo } from "react";

import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFamilyHeader } from "@/components/home-family-header";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import {
  curateAlbumsForAudience,
  curateSongsForAudience,
  filterAlbumsForAudience,
} from "@/lib/family-audience";

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
    const curatedCarouselAlbums = curateAlbumsForAudience(carouselAlbums, audienceId);
    const curatedShelfSongs = curateSongsForAudience(shelfSongs, audienceId);
    const curatedFamilyQueue = curateSongsForAudience(familyQueue, audienceId);
    const curatedSupplementary = filterAlbumsForAudience(supplementarySeries, audienceId);

    return {
      carouselAlbums: curatedCarouselAlbums,
      shelfSongs: curatedShelfSongs,
      familyQueue: curatedFamilyQueue,
      supplementarySeries: curatedSupplementary,
      featuredAlbum: curatedCarouselAlbums[0] ?? featuredAlbum,
    };
  }, [audienceId, carouselAlbums, familyQueue, featuredAlbum, shelfSongs, supplementarySeries]);

  return (
    <>
      <HomeFamilyHeader className="mb-4 pt-[max(12px,env(safe-area-inset-top))] sm:pt-2" />
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
      <HomeFeaturedShelf
        songs={curated.shelfSongs}
        tags={tags}
        listenerAge={listenerAge}
        audienceId={audienceId}
      />
      <HomeRecentQueue
        songs={curated.shelfSongs}
        familyQueue={curated.familyQueue}
        spotlightSlugs={spotlightSlugs}
        listenerAge={listenerAge}
        audienceId={audienceId}
      />
    </>
  );
}
