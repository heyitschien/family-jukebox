import { FavoritesBrowser } from "@/components/favorites-browser";
import { Topbar } from "@/components/topbar";
import { buildShareMetadata, formatPageTitle } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: formatPageTitle("Favorites"),
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
          A compact playlist saved on this browser — heart any song to add it.
        </p>
      </header>
      <FavoritesBrowser />
    </main>
  );
}
