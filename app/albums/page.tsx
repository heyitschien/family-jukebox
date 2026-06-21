import Link from "next/link";

import { AlbumCard } from "@/components/album-card";
import { Topbar } from "@/components/topbar";
import { getBrowseAlbumSections } from "@/data/albums";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: "Family Albums · Family Jukebox",
  description: "Growing series and full collections from every family member.",
});

export default function AlbumsPage() {
  const sections = getBrowseAlbumSections();

  return (
    <main className="min-w-0 px-3 pb-4 lg:px-0">
      <Topbar />

      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Family albums</h1>
        <p className="mt-2 max-w-xl text-[var(--jb-muted)]">
          Growing series gain tracks over time. Full collections hold every song from each family
          member — play a tracklist or jump into individual songs.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id}>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{section.title}</h2>
              <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">{section.subtitle}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {section.albums.map((album) => (
                <AlbumCard key={album.slug} album={album} size="sm" className="w-full" showKind />
              ))}
            </div>
          </section>
        ))}
      </div>

      {sections.length === 0 ? (
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
