import { FeaturedShelf } from "@/components/featured-shelf";
import { HeroSection } from "@/components/hero-section";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags, songs } from "@/data/songs";

export default function HomePage() {
  const featured = songs.find((s) => s.featured) ?? songs[0];

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      {featured ? <HeroSection featured={featured} /> : null}
      <FeaturedShelf songs={songs} tags={getAllTags()} />
      <RecentQueue songs={songs} />
    </main>
  );
}
