import { AlbumHero } from "@/components/album-hero";
import { AlbumShelf } from "@/components/album-shelf";
import { FeaturedShelf } from "@/components/featured-shelf";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { albums, getFeaturedAlbum, getRotatedAlbums } from "@/data/albums";
import { getAllTags } from "@/data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const featuredAlbum = getFeaturedAlbum(refreshSeed) ?? albums[0];
  const rotatedAlbums = getRotatedAlbums(refreshSeed);
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);

  return (
    <main className="min-w-0 space-y-4 px-3 lg:space-y-6 lg:px-0">
      <Topbar />
      {featuredAlbum ? (
        <AlbumHero
          album={featuredAlbum}
          stackAlbums={rotatedAlbums.filter((album) => album.slug !== featuredAlbum.slug)}
          familyQueue={familyQueue}
        />
      ) : null}
      <AlbumShelf
        title="Creator albums"
        description="Every creator now has a playable collection built from the songs already in the app."
        albums={rotatedAlbums}
        href="/albums"
        ctaLabel="Open album library"
      />
      <FeaturedShelf
        songs={shelfSongs}
        tags={getAllTags()}
        title="Tracks inside the albums"
        description="Still browse the singles view when you want to jump straight to individual songs."
      />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
