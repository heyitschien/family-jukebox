import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import { createRefreshSeed, getRotatedSpotlightSongs } from "@/lib/featured-rotation";

export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  const refreshSeed = createRefreshSeed();
  const spotlight = getRotatedSpotlightSongs(refreshSeed);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Today&apos;s spotlight</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          One rotating pick from each family member — fresh every day and on every visit.
        </p>
      </header>
      <FeaturedShelf songs={spotlight} tags={getAllTags()} />
    </main>
  );
}
