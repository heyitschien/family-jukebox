"use client";

import { Heart } from "lucide-react";

import { useFavoriteSongs } from "@/hooks/use-favorite-songs";
import { cn } from "@/lib/utils";

type SongFavoriteButtonProps = {
  songSlug: string;
  songTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "surface" | "overlay" | "player";
};

const sizeClasses: Record<NonNullable<SongFavoriteButtonProps["size"]>, string> = {
  sm: "size-8 min-h-8 min-w-8",
  md: "size-9 min-h-9 min-w-9",
  lg: "size-10 min-h-10 min-w-10",
};

const iconClasses: Record<NonNullable<SongFavoriteButtonProps["size"]>, string> = {
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
};

const variantClasses = {
  surface: {
    idle: "border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/10 hover:text-white",
    active:
      "border-[rgba(255,111,177,0.45)] bg-cr-soft text-[var(--cr-pink)] shadow-[0_0_16px_rgba(255,111,177,0.28)]",
  },
  overlay: {
    idle: "border-amber-200/70 bg-white/95 text-amber-800/80 hover:border-[rgba(255,111,177,0.45)] hover:text-[var(--cr-pink)]",
    active:
      "border-[rgba(255,111,177,0.5)] bg-[rgba(255,111,177,0.14)] text-[var(--cr-pink)] shadow-[0_0_14px_rgba(255,111,177,0.22)]",
  },
  player: {
    idle: "border-transparent bg-transparent text-[var(--jb-muted)] hover:bg-white/[0.06] hover:text-white",
    active:
      "border-transparent bg-family-soft text-[var(--cr-pink)] shadow-[0_0_18px_rgba(255,111,177,0.22)] ring-1 ring-[rgba(255,111,177,0.35)]",
  },
} as const;

export function SongFavoriteButton({
  songSlug,
  songTitle,
  className,
  size = "md",
  variant = "surface",
}: SongFavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoriteSongs();
  const favorite = isFavorite(songSlug);
  const styles = variantClasses[variant][favorite ? "active" : "idle"];

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
        "inline-flex shrink-0 items-center justify-center rounded-full border transition-all duration-200",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation] active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--family-pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        sizeClasses[size],
        styles,
        className,
      )}
    >
      <Heart
        className={cn(
          iconClasses[size],
          "transition-colors duration-200",
          favorite && "fill-current",
        )}
      />
      <span className="sr-only">
        {favorite ? `Remove ${songTitle} from favorites` : `Add ${songTitle} to favorites`}
      </span>
    </button>
  );
}
