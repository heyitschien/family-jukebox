import { FavoritesContent } from "@/components/favorites-content";
import { Topbar } from "@/components/topbar";

export default function FavoritesPage() {
  return (
    <main className="min-w-0 px-3 lg:px-0">
      <Topbar />
      <header className="mb-4 px-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Your favorites</h1>
        <p className="mt-1 text-sm font-bold text-[var(--jb-muted)]">
          Songs you love — saved on this device only.
        </p>
      </header>
      <FavoritesContent />
    </main>
  );
}
