import { AlbumCarousel3D } from "@/components/album-carousel-3d";
import { AlbumShelf } from "@/components/album-shelf";
import { FeaturedShelf } from "@/components/featured-shelf";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
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

export const dynamic = "force-dynamic";

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const featuredAlbum = getHeroFeaturedAlbum(refreshSeed);
  const carouselAlbums = getRotatedAlbumCarousel(refreshSeed);
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <AlbumCarousel3D
        albums={carouselAlbums}
        featuredAlbum={featuredAlbum}
        refreshSeed={refreshSeed}
      />
      <AlbumShelf albums={carouselAlbums} />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
