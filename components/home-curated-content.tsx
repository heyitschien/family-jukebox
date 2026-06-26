"use client";

import { useMemo } from "react";

import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFamilyPicks } from "@/components/home-family-picks";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeNewAtTheTable } from "@/components/home-new-at-table";
import { HomePlayFamily } from "@/components/home-play-family";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import { getAudienceCurationMicrocopy } from "@/lib/audience";
import { buildHomeFeed } from "@/lib/home-feed";

type HomeCuratedContentProps = {
  refreshSeed: number;
};

export function HomeCuratedContent({ refreshSeed }: HomeCuratedContentProps) {
  const { listenerAge } = useListenerAgeContext();

  const feed = useMemo(
    () => buildHomeFeed(refreshSeed, listenerAge),
    [listenerAge, refreshSeed],
  );

  const audienceMicrocopy =
    listenerAge !== null ? getAudienceCurationMicrocopy(listenerAge) : undefined;

  return (
    <>
      <HomeHeroCarousel
        albums={feed.hero.carouselAlbums}
        featuredAlbum={feed.hero.featuredAlbum}
        refreshSeed={refreshSeed}
        listenerAge={listenerAge}
        audienceMicrocopy={audienceMicrocopy}
      />
      <HomeNewAtTheTable songs={feed.newAtTheTable} />
      <HomeFamilyPicks songs={feed.todaysFamilyPicks} listenerAge={listenerAge} />
      {feed.growingWorlds.length > 0 ? (
        <HomeAlbumShelf
          albums={feed.growingWorlds}
          title="Growing worlds"
          subtitle={
            audienceMicrocopy
              ? `${audienceMicrocopy} — themed album worlds from every cousin`
              : "Themed album worlds to explore — each cousin's growing music universe"
          }
          showViewAll
        />
      ) : null}
      <HomePlayFamily familyQueue={feed.familyQueue} listenerAge={listenerAge} />
    </>
  );
}
