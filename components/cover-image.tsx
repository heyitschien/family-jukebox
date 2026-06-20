"use client";

import { Music2 } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
};

export function CoverImage({ src, alt, className, sizes }: CoverImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100",
          className,
        )}
        aria-label={alt}
      >
        <Music2 className="size-10 text-amber-700/60" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      className={cn("object-cover", className)}
      onError={() => setHasError(true)}
    />
  );
}
