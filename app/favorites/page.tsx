import { FavoritesScreen } from "@/components/favorites-screen";
import { buildShareMetadata } from "@/lib/site-metadata";

export const metadata = buildShareMetadata({
  title: "Favorites · Family Jukebox",
  description: "Songs saved locally on this browser for quick replay.",
  path: "/favorites",
});

export default function FavoritesPage() {
  return <FavoritesScreen />;
}
