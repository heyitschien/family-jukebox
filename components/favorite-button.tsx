"use client";

import { Heart } from "lucide-react";

import { useFavorites } from "@/contexts/favorites-context";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  slug: string;
  size?: "sm" | "md";
  className?: string;
};

export function FavoriteButton({ slug, size = "md", className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isHydrated } = useFavorites();
  const active = isHydrated && isFavorite(slug);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation]",
        "active:scale-95",
        size === "sm" ? "size-9 min-h-9 min-w-9" : "size-11 min-h-11 min-w-11",
        active
          ? "text-[var(--family-pink)] hover:text-[var(--family-pink)]/80"
          : "text-[var(--jb-muted)] hover:bg-white/[0.06] hover:text-white",
        className,
      )}
    >
      <Heart
        className={cn(size === "sm" ? "size-4" : "size-5", active && "fill-current")}
        aria-hidden
      />
    </button>
  );
}
