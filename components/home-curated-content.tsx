"use client";

import { useMemo } from "react";

import { AudienceSelector } from "@/components/AudienceSelector";
import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { InlineSearch } from "@/components/inline-search";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useListenerAgeContext } from "@/contexts/listener-age-context";
import type { Album } from "@/data/albums";
import type { Song } from "@/data/songs";
import {
  curateAlbumsForListener,
  curateSongsForListener,
  filterAlbumsForAudience,
  filterSongsForAudience,
  isAlbumVisibleForAudience,
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
  const { listenerAge, familyAudience } = useListenerAgeContext();

  const curated = useMemo(() => {
    const visibleCarouselAlbums = filterAlbumsForAudience(carouselAlbums, familyAudience);
    const visibleSupplementarySeries = filterAlbumsForAudience(supplementarySeries, familyAudience);
    const visibleShelfSongs = filterSongsForAudience(shelfSongs, familyAudience);
    const visibleFamilyQueue = filterSongsForAudience(familyQueue, familyAudience);
    const fallbackFeaturedAlbum =
      visibleCarouselAlbums[0] ?? visibleSupplementarySeries[0] ?? featuredAlbum;

    if (listenerAge === null) {
      return {
        carouselAlbums:
          visibleCarouselAlbums.length > 0
            ? visibleCarouselAlbums
            : carouselAlbums,
        supplementarySeries: visibleSupplementarySeries,
        shelfSongs: visibleShelfSongs,
        familyQueue: visibleFamilyQueue,
        featuredAlbum: isAlbumVisibleForAudience(featuredAlbum, familyAudience)
          ? featuredAlbum
          : fallbackFeaturedAlbum,
      };
    }

    const curatedCarouselAlbums = curateAlbumsForListener(
      visibleCarouselAlbums.length > 0 ? visibleCarouselAlbums : carouselAlbums,
      listenerAge,
    );

    return {
      carouselAlbums: curatedCarouselAlbums,
      supplementarySeries: visibleSupplementarySeries,
      shelfSongs: curateSongsForListener(visibleShelfSongs, listenerAge),
      familyQueue: curateSongsForListener(visibleFamilyQueue, listenerAge),
      featuredAlbum:
        curatedCarouselAlbums[0] ??
        (isAlbumVisibleForAudience(featuredAlbum, familyAudience)
          ? featuredAlbum
          : fallbackFeaturedAlbum),
    };
  }, [carouselAlbums, familyAudience, familyQueue, featuredAlbum, listenerAge, shelfSongs, supplementarySeries]);

  return (
    <>
      <section className="mb-4 rounded-[28px] border border-white/[0.08] bg-[rgba(13,18,26,0.68)] p-3 shadow-[0_16px_44px_rgba(0,0,0,0.3)] backdrop-blur-[18px] sm:mb-5 sm:p-4">
        <div className="flex items-center gap-2.5">
          <InlineSearch className="flex-1" />
          <ProfileAvatar />
        </div>
        <p className="mt-3 text-sm font-bold text-[var(--jb-muted)]">Music for your family</p>
        <AudienceSelector className="mt-2" />
      </section>

      <HomeHeroCarousel
        albums={curated.carouselAlbums}
        featuredAlbum={curated.featuredAlbum}
        refreshSeed={refreshSeed}
        showTopbar={false}
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
