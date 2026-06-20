import { SiteHeader } from "@/components/site-header";
import { FeaturedSong } from "@/components/featured-song";
import { SongGrid } from "@/components/song-grid";
import { getAllTags, songs } from "@/data/songs";

export default function HomePage() {
  const featuredSong = songs.find((song) => song.featured) ?? songs[0];
  const gallerySongs = songs.filter((song) => song.slug !== featuredSong?.slug);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <section className="mb-12 text-center sm:text-left">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
            Made together
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-amber-950 sm:text-5xl">
            Family Jukebox
          </h1>
          <p className="mt-3 text-xl text-amber-900/80">
            Songs, silly memories, and little family anthems.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-amber-900/70 sm:mx-0">
            A living archive of songs we made together — for cousins, kids, family nights,
            inside jokes, and memories worth replaying.
          </p>
        </section>

        {featuredSong ? <FeaturedSong song={featuredSong} /> : null}

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-amber-950">All songs</h2>
            <p className="mt-1 text-amber-900/70">Browse, search, and replay the family collection.</p>
          </div>
          <SongGrid songs={gallerySongs.length > 0 ? gallerySongs : songs} tags={getAllTags()} />
        </section>
      </main>

      <footer className="border-t border-amber-200/60 bg-white/70 py-8 text-center text-sm text-amber-800/70">
        Made with love for the family.
      </footer>
    </>
  );
}
