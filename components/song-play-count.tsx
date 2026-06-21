import { getSongPlayStats } from "@/lib/analytics/plays";

type SongPlayCountProps = {
  songSlug: string;
};

function formatCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(value);
}

export async function SongPlayCount({ songSlug }: SongPlayCountProps) {
  const stats = await getSongPlayStats(songSlug);
  if (!stats || stats.playCount === 0) return null;

  return (
    <span className="inline-flex items-center rounded-full border border-white/[0.09] bg-white/[0.07] px-2.5 py-1 text-xs font-extrabold text-[var(--family-ocean)]">
      {formatCount(stats.playCount)} {stats.playCount === 1 ? "play" : "plays"}
      {stats.uniqueListeners > 1 ? ` · ${stats.uniqueListeners} listeners` : ""}
    </span>
  );
}
