import { HomeCuratedContent } from "@/components/home-curated-content";
import { buildHomeFeed, createRefreshSeed } from "@/lib/home-feed";
import { buildShareMetadata } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export const metadata = buildShareMetadata();

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const feed = buildHomeFeed(refreshSeed);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <HomeCuratedContent refreshSeed={refreshSeed} feed={feed} />
    </main>
  );
}
