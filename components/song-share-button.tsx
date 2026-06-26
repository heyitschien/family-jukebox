"use client";

import { useState } from "react";
import { Link2, Share2 } from "lucide-react";

import { sharePublicLink } from "@/lib/share";
import { cn } from "@/lib/utils";

type SongShareButtonProps = {
  songSlug: string;
  songTitle: string;
  shareText?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "surface" | "player";
};

const FEEDBACK_MS = 2200;

const sizeClasses: Record<NonNullable<SongShareButtonProps["size"]>, string> = {
  sm: "size-8 min-h-8 min-w-8",
  md: "size-11 min-h-11 min-w-11",
  lg: "size-10 min-h-10 min-w-10",
};

const iconClasses: Record<NonNullable<SongShareButtonProps["size"]>, string> = {
  sm: "size-4",
  md: "size-[18px]",
  lg: "size-5",
};

const variantClasses = {
  surface:
    "border border-white/10 bg-white/10 text-white hover:bg-white/[0.14] active:scale-95",
  player:
    "border-transparent bg-transparent text-[var(--jb-muted)] hover:bg-white/[0.06] hover:text-white active:scale-95",
} as const;

export function SongShareButton({
  songSlug,
  songTitle,
  shareText,
  className,
  size = "md",
  variant = "player",
}: SongShareButtonProps) {
  const [feedback, setFeedback] = useState<"shared" | "copied" | "failed" | null>(null);

  async function handleShare() {
    const result = await sharePublicLink({
      title: songTitle,
      path: `/songs/${songSlug}`,
      text: shareText,
    });

    if (result === "shared") {
      setFeedback("shared");
    } else if (result === "copied") {
      setFeedback("copied");
    } else if (result === "failed") {
      setFeedback("failed");
    }

    if (result !== "cancelled") {
      window.setTimeout(() => setFeedback(null), FEEDBACK_MS);
    }
  }

  const label =
    feedback === "shared"
      ? `${songTitle} shared`
      : feedback === "copied"
        ? "Link copied"
        : feedback === "failed"
          ? "Could not share"
          : `Share ${songTitle}`;

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-200",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--family-pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        feedback === "copied" || feedback === "shared"
          ? "bg-family-soft text-family-glow shadow-[0_0_18px_rgba(255,111,177,0.22)] ring-1 ring-[rgba(255,111,177,0.35)]"
          : variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {feedback === "copied" ? (
        <Link2 className={iconClasses[size]} aria-hidden />
      ) : (
        <Share2 className={iconClasses[size]} aria-hidden />
      )}
    </button>
  );
}
