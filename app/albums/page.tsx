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
      <AlbumsBrowser sections={sections} />
    </main>
  );
}
