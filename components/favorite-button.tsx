"use client";

import type { MouseEvent } from "react";
import { Heart } from "lucide-react";

import { useFavorites } from "@/contexts/favorites-context";
import type { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  song: Pick<Song, "slug" | "title">;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "floating" | "subtle" | "pill";
};

const sizeClasses = {
  sm: "size-9 min-h-9 min-w-9",
  md: "size-11 min-h-11 min-w-11",
  lg: "size-12 min-h-12 min-w-12",
} as const;

const iconSizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-5",
} as const;

export function FavoriteButton({
  song,
  className,
  showLabel = false,
  size = "md",
  variant = "subtle",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(song.slug);
  const label = active ? `Remove ${song.title} from favorites` : `Add ${song.title} to favorites`;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(song.slug);
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active ? "true" : "false"}
      title={active ? "Favorited" : "Add to favorites"}
      onClick={handleClick}
      className={cn(
        "group/favorite inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-black transition-all duration-200",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation] active:scale-95",
        showLabel ? "min-h-11 px-4 py-2.5 text-sm" : sizeClasses[size],
        variant === "floating" &&
          "border border-white/80 bg-white/95 text-[#1a0812] shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:bg-white",
        variant === "subtle" &&
          "border border-white/10 bg-white/10 text-[var(--jb-muted)] hover:bg-white/[0.16] hover:text-white",
        variant === "pill" &&
          "border border-[rgba(255,111,177,0.28)] bg-family-soft text-family-glow hover:bg-[rgba(255,111,177,0.2)]",
        active &&
          "border-[rgba(255,111,177,0.42)] bg-family-soft text-family-glow shadow-[0_0_22px_rgba(255,111,177,0.2)]",
        className,
      )}
    >
      <Heart
        className={cn(
          iconSizeClasses[size],
          "transition-transform duration-200 group-hover/favorite:scale-110",
          active && "fill-current",
        )}
      />
      {showLabel ? <span>{active ? "Favorited" : "Favorite"}</span> : null}
    </button>
  );
}
