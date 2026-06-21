import { AlbumHeroShowcase } from "@/components/album-hero-showcase";
import { AlbumShowcaseGrid } from "@/components/album-showcase-grid";
import { FeaturedShelf } from "@/components/featured-shelf";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getRotatedAlbumBundles } from "@/data/albums";
import { getAllTags } from "@/data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);
  const albumBundles = getRotatedAlbumBundles(refreshSeed).slice(0, 5);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <AlbumHeroShowcase bundles={albumBundles} />
      <AlbumShowcaseGrid
        bundles={albumBundles}
        title="Album spotlight"
        description="Dynamic creator albums built from existing tracks."
      />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
