import { HomeAlbumShelf } from "@/components/home-album-shelf";
import { HomeFeaturedShelf } from "@/components/home-featured-shelf";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { HomeRecentQueue } from "@/components/home-recent-queue";
import { getSupplementarySeriesAlbums } from "@/data/albums";
import { getAllTags } from "@/data/songs";
import {
  createRefreshSeed,
  getHeroFeaturedAlbum,
  getRotatedAlbumCarousel,
} from "@/lib/album-rotation";
import {
  getFairRotationQueue,
  getRotatedFeaturedShelf,
  getSpotlightSongPerMember,
} from "@/lib/featured-rotation";
import { buildShareMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata = buildShareMetadata();

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const featuredAlbum = getHeroFeaturedAlbum(refreshSeed);
  const carouselAlbums = getRotatedAlbumCarousel(refreshSeed);
  const supplementarySeries = getSupplementarySeriesAlbums();
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);
  const spotlightSlugs = getSpotlightSongPerMember().map((song) => song.slug);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <HomeHeroCarousel
        albums={carouselAlbums}
        featuredAlbum={featuredAlbum}
        refreshSeed={refreshSeed}
      />
      <HomeAlbumShelf albums={carouselAlbums} subtitle="One album per family member — tap to explore or play" />
      {supplementarySeries.length > 0 ? (
        <HomeAlbumShelf
          albums={supplementarySeries}
          title="Growing series"
          subtitle="Themed albums gaining new singles — not in the hero ring yet"
          showViewAll
        />
      ) : null}
      <HomeFeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <HomeRecentQueue songs={shelfSongs} familyQueue={familyQueue} spotlightSlugs={spotlightSlugs} />
    </main>
  );
}
