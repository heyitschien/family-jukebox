"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";

type SongVideoProps = {
  videoSrc: string;
  title: string;
};

export function SongVideo({ videoSrc, title }: SongVideoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm text-[var(--jb-muted)]">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <p>Video not found yet. Add it to public/assets or keep audio + cover only.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black">
      <video controls preload="metadata" className="aspect-video w-full" onError={() => setHasError(true)}>
        <source src={videoSrc} type="video/mp4" />
      </video>
      <p className="sr-only">{title} video</p>
    </div>
  );
}
