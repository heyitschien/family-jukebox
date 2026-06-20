import { FeaturedShelf } from "@/components/featured-shelf";
import { HeroSection } from "@/components/hero-section";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import {
  getDayIndex,
  getHeroRotationPool,
  getRotatedFeaturedShelf,
  getSpotlightAuthorNames,
} from "@/lib/featured-rotation";

export default function HomePage() {
  const dayIndex = getDayIndex();
  const featuredSongs = getHeroRotationPool(dayIndex);
  const shelfSongs = getRotatedFeaturedShelf(dayIndex);
  const spotlightNames = getSpotlightAuthorNames(dayIndex);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <HeroSection featuredSongs={featuredSongs} dayIndex={dayIndex} spotlightNames={spotlightNames} />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} />
    </main>
  );
}
