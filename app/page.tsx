import { FeaturedShelf } from "@/components/featured-shelf";
import { HeroSection } from "@/components/hero-section";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import {
  getHeroFeaturedSong,
  getHeroFeaturedSongs,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";

export default function HomePage() {
  const featured = getHeroFeaturedSong();
  const heroSongs = getHeroFeaturedSongs();
  const shelfSongs = getRotatedFeaturedShelf();

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <HeroSection featured={featured} featuredSongs={heroSongs} />
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} />
    </main>
  );
}
