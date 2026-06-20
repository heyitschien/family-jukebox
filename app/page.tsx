import { SiteHeader } from "@/components/site-header";
import { FeaturedSong } from "@/components/featured-song";
import { MemberCard } from "@/components/member-card";
import { SongGrid } from "@/components/song-grid";
import { getAllAges, members } from "@/data/members";
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
            A living archive of songs we made together — our girls, Ocean, and Tio Chien —
            for cousin nights, inside jokes, and memories worth replaying.
          </p>
        </section>

        <section className="mb-14 space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-amber-950">The family</h2>
            <p className="mt-1 text-amber-900/70">
              Browse by person — Marceline, Eliana, Solene, Ocean, and Tio Chien.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <MemberCard key={member.slug} member={member} />
            ))}
          </div>
        </section>

        {featuredSong ? <FeaturedSong song={featuredSong} /> : null}

        <section className="mt-14 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-amber-950">All songs</h2>
            <p className="mt-1 text-amber-900/70">
              Grouped by author. Search by name, age, or tag.
            </p>
          </div>
          <SongGrid
            songs={gallerySongs.length > 0 ? gallerySongs : songs}
            tags={getAllTags()}
            members={members}
            ages={getAllAges()}
          />
        </section>
      </main>

      <footer className="border-t border-amber-200/60 bg-white/70 py-8 text-center text-sm text-amber-800/70">
        Made with love for the family.
      </footer>
    </>
  );
}
