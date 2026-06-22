import { AlbumsBrowser } from "@/components/albums-browser";
import { Topbar } from "@/components/topbar";
import { getBrowseAlbumSections } from "@/data/albums";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Family albums"),
  description: "Growing series and full collections from every family member.",
  path: "/albums",
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

      <AlbumsBrowser sections={sections} />
    </main>
  );
}
