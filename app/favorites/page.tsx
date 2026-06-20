import { FeaturedShelf } from "@/components/featured-shelf";
import { Topbar } from "@/components/topbar";
import { getAllTags, songs } from "@/data/songs";

export default function FavoritesPage() {
  const favorites = songs.filter((s) => s.featured);

  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Favorites</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Featured picks and replay-worthy anthems.
        </p>
      </header>
      <FeaturedShelf
        songs={favorites.length > 0 ? favorites : songs}
        tags={getAllTags()}
      />
    </main>
  );
}
