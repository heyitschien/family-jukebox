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
      <div className="flex items-start gap-2 rounded-2xl border border-amber-200/70 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <p>
          Video not found yet. Add it to{" "}
          <code className="rounded bg-amber-100 px-1">public/assets/videos/</code> or keep
          audio + cover only for a lighter repo.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200/70 bg-black shadow-sm">
      <video
        controls
        preload="metadata"
        className="aspect-video w-full"
        onError={() => setHasError(true)}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video element.
      </video>
      <p className="sr-only">{title} video</p>
    </div>
  );
}
