"use client";

import { useMemo } from "react";

import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFamilyPicks } from "@/components/home-family-picks";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeNewAtTheTable } from "@/components/home-new-at-table";
import { HomePlayFamily } from "@/components/home-play-family";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import { curateAlbumsForListener, curateSongsForListener } from "@/lib/audience";
import type { HomeFeed } from "@/lib/home-feed";

type HomeCuratedContentProps = {
  refreshSeed: number;
  feed: HomeFeed;
};

export function HomeCuratedContent({ refreshSeed, feed }: HomeCuratedContentProps) {
  const { listenerAge } = useListenerAgeContext();

  const curated = useMemo(() => {
    if (listenerAge === null) {
      return feed;
    }

    const carouselAlbums = curateAlbumsForListener(feed.hero.carouselAlbums, listenerAge);
    return {
      hero: {
        featuredAlbum: carouselAlbums[0] ?? feed.hero.featuredAlbum,
        carouselAlbums,
        spotlightTrack: feed.hero.spotlightTrack,
      },
      newAtTheTable: curateSongsForListener(feed.newAtTheTable, listenerAge),
      todaysFamilyPicks: curateSongsForListener(feed.todaysFamilyPicks, listenerAge),
      growingWorlds: curateAlbumsForListener(feed.growingWorlds, listenerAge),
      familyQueue: curateSongsForListener(feed.familyQueue, listenerAge),
    };
  }, [feed, listenerAge]);

  return (
    <>
      <HomeHeroCarousel
        albums={curated.hero.carouselAlbums}
        featuredAlbum={curated.hero.featuredAlbum}
        refreshSeed={refreshSeed}
      />
      <HomeNewAtTheTable songs={curated.newAtTheTable} />
      <HomeFamilyPicks songs={curated.todaysFamilyPicks} listenerAge={listenerAge} />
      {curated.growingWorlds.length > 0 ? (
        <HomeAlbumShelf
          albums={curated.growingWorlds}
          title="Growing worlds"
          subtitle="Themed album worlds to explore — each cousin's growing music universe"
          showViewAll
        />
      ) : null}
      <HomePlayFamily familyQueue={curated.familyQueue} listenerAge={listenerAge} />
    </>
  );
}
