import { AlbumShowcaseGrid } from "@/components/album-showcase-grid";
import { Topbar } from "@/components/topbar";
import { getAlbumBundles } from "@/data/albums";

export default function AlbumsPage() {
  const bundles = getAlbumBundles();

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Albums</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Creator collections built from the songs already in Family Jukebox.
        </p>
      </header>
      <AlbumShowcaseGrid
        bundles={bundles}
        title="Creator albums"
        description="Press play on any album and run the full queue."
        className="mt-0"
      />
    </main>
  );
}
