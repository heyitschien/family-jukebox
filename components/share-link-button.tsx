"use client";

import { useState } from "react";
import { Link2, Share2 } from "lucide-react";

import { sharePublicLink } from "@/lib/share";
import { cn } from "@/lib/utils";

type ShareLinkButtonProps = {
  title: string;
  path: string;
  text?: string;
  className?: string;
  variant?: "primary" | "secondary";
};

const FEEDBACK_MS = 2200;

export function ShareLinkButton({
  title,
  path,
  text,
  className,
  variant = "secondary",
}: ShareLinkButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    const result = await sharePublicLink({ title, path, text });
    if (result === "shared") {
      setFeedback("Shared");
    } else if (result === "copied") {
      setFeedback("Link copied");
    } else if (result === "failed") {
      setFeedback("Could not share");
    }

    if (result !== "cancelled") {
      window.setTimeout(() => setFeedback(null), FEEDBACK_MS);
    }
  }

  const label = feedback ?? "Share";

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-black [-webkit-tap-highlight-color:transparent]",
        variant === "primary"
          ? "bg-white text-[#050608]"
          : "border border-white/10 bg-white/10 text-white",
        className,
      )}
    >
      {feedback === "Link copied" ? (
        <Link2 className="size-4" aria-hidden />
      ) : (
        <Share2 className="size-4" aria-hidden />
      )}
      {label}
    </button>
  );
}
