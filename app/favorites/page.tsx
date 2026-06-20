import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import { getSpotlightSongPerMember } from "@/lib/featured-rotation";

export default function FavoritesPage() {
  const spotlight = getSpotlightSongPerMember();

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Today&apos;s spotlight</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          One rotating pick from each family member — fair and fresh every day.
        </p>
      </header>
      <FeaturedShelf songs={spotlight} tags={getAllTags()} />
    </main>
  );
}
