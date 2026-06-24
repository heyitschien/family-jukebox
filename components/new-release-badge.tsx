import type { Song } from "@/data/songs";
import { getNewReleaseLabel } from "@/lib/new-releases";
import { cn } from "@/lib/utils";

type NewReleaseBadgeProps = {
  song: Song;
  className?: string;
  now?: Date;
};

export function NewReleaseBadge({ song, className, now }: NewReleaseBadgeProps) {
  const label = getNewReleaseLabel(song, now);
  if (!label) return null;

  return (
    <span
      className={cn(
        "shrink-0 rounded-full bg-family-accent px-2 py-0.5 text-[10px] font-black leading-none text-[#1a0812] sm:text-[11px]",
        className,
      )}
    >
      {label}
    </span>
  );
}
