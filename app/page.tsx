import { HomeCuratedContent } from "@/components/home-curated-content";
import { getGrowingSeriesAlbums } from "@/data/albums";
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
  const growingSeriesAlbums = getGrowingSeriesAlbums();
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);
  const spotlightSlugs = getSpotlightSongPerMember().map((song) => song.slug);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <HomeCuratedContent
        refreshSeed={refreshSeed}
        featuredAlbum={featuredAlbum}
        carouselAlbums={carouselAlbums}
        growingSeriesAlbums={growingSeriesAlbums}
        shelfSongs={shelfSongs}
        familyQueue={familyQueue}
        spotlightSlugs={spotlightSlugs}
        tags={getAllTags()}
      />
    </main>
  );
}
