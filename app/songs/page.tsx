import { AlbumShelf } from "@/components/album-shelf";
import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { albums } from "@/data/albums";
import { getAllTags } from "@/data/songs";
import { getRotatedFeaturedShelf } from "@/lib/featured-rotation";

export default function SongsPage() {
  return (
    <main className="min-w-0 space-y-4 px-3 lg:space-y-6 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">All songs</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Spotlight picks from each family member up front — rotates daily.
        </p>
      </header>
      <AlbumShelf
        title="Browse by album first"
        description="Jump into a creator collection, then come back to tracks when you want the singles view."
        albums={albums}
        href="/albums"
        ctaLabel="See all albums"
      />
      <FeaturedShelf songs={getRotatedFeaturedShelf()} tags={getAllTags()} />
    </main>
  );
}
