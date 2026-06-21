import { AlbumShowcaseGrid } from "@/components/album-showcase-grid";
import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAlbumBundles } from "@/data/albums";
import { getAllTags } from "@/data/songs";
import { getRotatedFeaturedShelf } from "@/lib/featured-rotation";

export default function SongsPage() {
  const albumBundles = getAlbumBundles();

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
      <AlbumShowcaseGrid
        bundles={albumBundles}
        title="Albums behind the songs"
        description="Jump into creator albums and keep playback flowing."
      />
    </main>
  );
}
