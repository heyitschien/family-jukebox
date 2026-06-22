import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import { getRotatedFeaturedShelf } from "@/lib/featured-rotation";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("All songs"),
  description: "Browse every family song — spotlight picks from each cousin, rotating daily.",
  path: "/songs",
});

export default function SongsPage() {
  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">All songs</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Spotlight picks from each family member up front — rotates daily.
        </p>
      </header>
      <FeaturedShelf songs={getRotatedFeaturedShelf()} tags={getAllTags()} />
    </main>
  );
}
