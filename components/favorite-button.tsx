"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/contexts/favorites-context";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  songSlug: string;
  songTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "overlay" | "ghost" | "pill";
  showLabel?: boolean;
};

const sizeClasses = {
  sm: "size-9",
  md: "size-10",
  lg: "size-12",
} as const;

const iconClasses = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
} as const;

export function FavoriteButton({
  songSlug,
  songTitle,
  className,
  size = "md",
  variant = "ghost",
  showLabel = false,
}: FavoriteButtonProps) {
  const { favoritesReady, isFavorite, toggleFavorite } = useFavorites();
  const favorite = favoritesReady && isFavorite(songSlug);

  return (
    <button
      type="button"
      disabled={!favoritesReady}
      aria-pressed={favorite}
      aria-label={favorite ? `Remove ${songTitle} from favorites` : `Save ${songTitle} to favorites`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(songSlug);
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-black transition disabled:cursor-wait disabled:opacity-60",
        !showLabel && sizeClasses[size],
        variant === "overlay" &&
          (favorite
            ? "bg-family-accent text-[#1a0812] shadow-[0_12px_24px_rgba(255,111,177,0.24)]"
            : "bg-[rgba(9,12,16,0.72)] text-white/80 backdrop-blur-sm hover:text-white"),
        variant === "ghost" &&
          (favorite
            ? "text-[var(--family-pink)]"
            : "text-[var(--jb-muted)] hover:bg-white/[0.08] hover:text-white"),
        variant === "pill" &&
          (favorite
            ? "min-h-11 bg-family-accent px-5 py-3 text-[#1a0812]"
            : "min-h-11 border border-white/10 bg-white/10 px-5 py-3 text-white"),
        className,
      )}
    >
      <Heart className={cn(iconClasses[size], favorite && "fill-current")} />
      {showLabel ? <span>{favorite ? "Saved" : "Save"}</span> : null}
    </button>
  );
}
