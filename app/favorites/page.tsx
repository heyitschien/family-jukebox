import { FavoritesScreen } from "@/components/favorites-screen";
import { Topbar } from "@/components/topbar";
import { songs } from "@/data/songs";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: "Favorites · Family Jukebox",
  description: "Your locally saved family songs on this browser.",
  path: "/favorites",
});

export default function FavoritesPage() {
  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Favorites</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Heart the songs you love and they stay here on this browser.
        </p>
      </header>
      <FavoritesScreen songs={songs} />
    </main>
  );
}
