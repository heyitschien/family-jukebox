import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { Topbar } from "@/components/topbar";
import { getAllAlbums } from "@/data/albums";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: "Family Albums · Family Jukebox",
  description: "One album per cousin — explore every collection we made together.",
});

export default function AlbumsPage() {
  const allAlbums = getAllAlbums();

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Family albums</h1>
        <p className="mt-2 max-w-xl text-[var(--jb-muted)]">
          Every cousin has their own collection — spin through albums, play a full tracklist, or
          jump into individual songs.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {allAlbums.map((album) => (
          <AlbumCard key={album.slug} album={album} size="sm" className="w-full" />
        ))}
      </div>

      {allAlbums.length === 0 ? (
        <p className="text-[var(--jb-muted)]">No albums yet — check back after the next music day.</p>
      ) : null}

      <p className="mt-8 text-center">
        <Link href="/" className="text-sm font-bold text-[var(--family-pink)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </main>
  );
}
