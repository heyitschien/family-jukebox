"use client";

import { useMemo } from "react";

import { AudienceSelector } from "@/components/AudienceSelector";
import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { Topbar } from "@/components/topbar";
import { useFamilyAudienceContext } from "@/contexts/family-audience-context";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import { curateAlbumsForAudience, curateSongsForAudience } from "@/lib/audience";

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
  const { audienceId } = useFamilyAudienceContext();

  const curated = useMemo(() => {
    const audienceAlbums = curateAlbumsForAudience(carouselAlbums, audienceId);
    const audienceSupplementarySeries = curateAlbumsForAudience(supplementarySeries, audienceId);
    const audienceShelfSongs = curateSongsForAudience(shelfSongs, audienceId);
    const audienceFamilyQueue = curateSongsForAudience(familyQueue, audienceId);
    const selectedFeaturedAlbum =
      curateAlbumsForAudience([featuredAlbum], audienceId)[0] ??
      audienceAlbums[0] ??
      featuredAlbum;
    const visibleTags = Array.from(
      new Set(audienceShelfSongs.flatMap((song) => song.tags).filter((tag) => tags.includes(tag))),
    );

    return {
      carouselAlbums: audienceAlbums.length > 0 ? audienceAlbums : carouselAlbums,
      supplementarySeries: audienceSupplementarySeries,
      shelfSongs: audienceShelfSongs.length > 0 ? audienceShelfSongs : shelfSongs,
      familyQueue: audienceFamilyQueue.length > 0 ? audienceFamilyQueue : familyQueue,
      featuredAlbum: selectedFeaturedAlbum,
      tags: visibleTags.length > 0 ? visibleTags : tags,
    };
  }, [audienceId, carouselAlbums, familyQueue, featuredAlbum, shelfSongs, supplementarySeries, tags]);

  return (
    <>
      <div className="space-y-3 py-3 lg:py-0">
        <Topbar />
        <AudienceSelector />
      </div>
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
      <HomeFeaturedShelf songs={curated.shelfSongs} tags={curated.tags} audienceId={audienceId} />
      <HomeRecentQueue
        songs={curated.shelfSongs}
        familyQueue={curated.familyQueue}
        spotlightSlugs={spotlightSlugs}
        audienceId={audienceId}
      />
    </>
  );
}
