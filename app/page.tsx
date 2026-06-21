import { AlbumCarousel3D } from "@/components/album-carousel-3d";
import { AlbumShelf } from "@/components/album-shelf";
import { FeaturedShelf } from "@/components/featured-shelf";
import { RecentQueue } from "@/components/recent-queue";
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

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <AlbumCarousel3D
        albums={carouselAlbums}
        featuredAlbum={featuredAlbum}
        refreshSeed={refreshSeed}
      />
      <AlbumShelf albums={carouselAlbums} subtitle="One album per family member — tap to explore or play" />
      {supplementarySeries.length > 0 ? (
        <AlbumShelf
          albums={supplementarySeries}
          title="Growing series"
          subtitle="Themed albums gaining new singles — not in the hero ring yet"
          showViewAll
        />
      ) : null}
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
