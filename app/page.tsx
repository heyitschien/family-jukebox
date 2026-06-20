import { FeaturedShelf } from "@/components/featured-shelf";
import { HeroSection } from "@/components/hero-section";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import {
  getHeroFeaturedSong,
  getRefreshSeed,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const featured = getHeroFeaturedSong(getRefreshSeed());
  const shelfSongs = getRotatedFeaturedShelf();

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <HeroSection featured={featured} />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} />
    </main>
  );
}
