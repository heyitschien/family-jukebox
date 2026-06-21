import { AlbumCard } from "@/components/album-card";
import { AlbumHero } from "@/components/album-hero";
import { FeaturedShelf } from "@/components/featured-shelf";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { RecentQueue } from "@/components/recent-queue";
import { Topbar } from "@/components/topbar";
import { getAllTags } from "@/data/songs";
import {
  createRefreshSeed,
  getFairRotationQueue,
  getHeroFeaturedSong,
  getRotatedFeaturedShelf,
} from "@/lib/featured-rotation";
import { getAlbumByMemberSlug, getRotatedFamilyAlbums } from "@/lib/albums";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const refreshSeed = createRefreshSeed();
  const featured = getHeroFeaturedSong(refreshSeed);
  const shelfSongs = getRotatedFeaturedShelf(refreshSeed);
  const familyQueue = getFairRotationQueue(refreshSeed);
  const albums = getRotatedFamilyAlbums(refreshSeed);
  const featuredAlbumSlug = getAlbumByMemberSlug(featured.authorSlug)?.slug ?? albums[0]?.slug ?? "";

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <AlbumHero albums={albums} featuredAlbumSlug={featuredAlbumSlug} familyQueue={familyQueue} />
      <section className="mt-4 rounded-[28px] border border-white/[0.07] bg-[rgba(17,24,33,0.58)] py-4 sm:py-[22px] lg:mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-4 sm:px-[22px]">
          <div>
            <h2 className="text-[22px] font-bold tracking-tight sm:text-[26px]">Creator albums</h2>
            <p className="text-sm font-bold text-[var(--jb-muted)]">
              Each album is built from the songs that already belong to that creator.
            </p>
          </div>
        </div>
        <HorizontalScroll className="px-4 sm:px-[22px]">
          {albums.map((album) => (
            <AlbumCard key={album.slug} album={album} />
          ))}
        </HorizontalScroll>
      </section>
      <FeaturedShelf songs={shelfSongs} tags={getAllTags()} />
      <RecentQueue songs={shelfSongs} familyQueue={familyQueue} />
    </main>
  );
}
