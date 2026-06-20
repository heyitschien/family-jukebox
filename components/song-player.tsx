"use client";

import { AlertCircle } from "lucide-react";
import { useState } from "react";

type SongPlayerProps = {
  title: string;
  audioSrc: string;
};

export function SongPlayer({ title, audioSrc }: SongPlayerProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-amber-900/80">Now playing</p>
      <p className="mb-4 text-xl font-bold text-amber-950">{title}</p>
      {hasError ? (
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>
            Media file not found yet. Add it to the{" "}
            <code className="rounded bg-amber-100 px-1">public/assets/songs/</code> folder.
          </p>
        </div>
      ) : (
        <audio
          controls
          preload="metadata"
          className="w-full"
          onError={() => setHasError(true)}
        >
          <source src={audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
