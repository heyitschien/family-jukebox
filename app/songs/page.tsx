import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAllTags, songs } from "@/data/songs";

export default function SongsPage() {
  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">All songs</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Every family anthem in one shelf.
        </p>
      </header>
      <FeaturedShelf songs={songs} tags={getAllTags()} />
    </main>
  );
}
