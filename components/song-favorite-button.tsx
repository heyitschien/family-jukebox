"use client";

import { Heart } from "lucide-react";

import { useFavoriteSongs } from "@/hooks/use-favorite-songs";
import { cn } from "@/lib/utils";

type SongFavoriteButtonProps = {
  songSlug: string;
  songTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<SongFavoriteButtonProps["size"]>, string> = {
  sm: "size-8",
  md: "size-9",
  lg: "size-10",
};

const iconClasses: Record<NonNullable<SongFavoriteButtonProps["size"]>, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

export function SongFavoriteButton({
  songSlug,
  songTitle,
  className,
  size = "md",
}: SongFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteSongs();
  const favorite = isFavorite(songSlug);

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? `Remove ${songTitle} from favorites` : `Add ${songTitle} to favorites`}
      title={favorite ? "Remove from favorites" : "Add to favorites"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(songSlug);
      }}
      className={cn(
        "inline-flex items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--family-pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        sizeClasses[size],
        favorite
          ? "border-transparent bg-[var(--family-pink)] text-[#1a0812]"
          : "border-white/20 bg-black/35 text-white/85 hover:border-white/40 hover:text-white",
        className,
      )}
    >
      <Heart className={cn(iconClasses[size], favorite && "fill-current")} />
      <span className="sr-only">
        {favorite ? `Remove ${songTitle} from favorites` : `Add ${songTitle} to favorites`}
      </span>
    </button>
  );
}
