import { FeaturedShelf } from "@/components/featured-shelf";
import { HeroSection } from "@/components/hero-section";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getHeroFeaturedSong,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const featured = getHeroFeaturedSong(refreshSeed);
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <HeroSection featured={featured} playlist={shelfSongs} familyQueue={familyQueue} />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
