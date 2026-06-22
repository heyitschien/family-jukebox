"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";

import { sharePublicLink } from "@/lib/share";
import { SITE_NAME } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

type CopyPublicLinkButtonProps = {
  className?: string;
};

const FEEDBACK_MS = 2200;

export function CopyPublicLinkButton({ className }: CopyPublicLinkButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleCopy() {
    const result = await sharePublicLink({
      title: SITE_NAME,
      path: "/",
      text: SITE_NAME,
    });

    if (result === "shared") {
      setFeedback("Shared");
    } else if (result === "copied") {
      setFeedback("Link copied");
    } else if (result === "failed") {
      setFeedback("Copy failed");
    }

    if (result !== "cancelled") {
      window.setTimeout(() => setFeedback(null), FEEDBACK_MS);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy public site link"
      className={cn(
        "hidden min-h-11 items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.07] px-3.5 py-2.5 text-sm font-extrabold whitespace-nowrap transition hover:bg-white/[0.12] lg:inline-flex",
        className,
      )}
    >
      <Link2 className="size-4" aria-hidden />
      {feedback ?? "Copy site link"}
    </button>
  );
}
