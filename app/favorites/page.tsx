import { FavoritesBrowser } from "@/components/favorites-browser";
import { Topbar } from "@/components/topbar";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: "Favorites · Family Jukebox",
  description: "Your locally saved favorite songs on this browser.",
  path: "/favorites",
});

export default function FavoritesPage() {
  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Your favorites</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Saved only on this browser. Tap a heart on any song to add or remove it.
        </p>
      </header>
      <FavoritesBrowser />
    </main>
  );
}
