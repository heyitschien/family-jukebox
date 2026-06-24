"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CRMark } from "@/components/brand/cr-mark";
import { GradientText } from "@/components/brand/gradient-text";
import {
  BRAND_LOGO_PATHS,
  BRAND_NAME,
  BRAND_SIGNATURE,
  BRAND_TAGLINE,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandWordmarkProps = {
  className?: string;
  variant?: "full" | "compact" | "hero";
  showTagline?: boolean;
  showSignature?: boolean;
  showLogo?: boolean;
  tagline?: string;
  titleClassName?: string;
  taglineClassName?: string;
  useGradientTagline?: boolean;
  href?: string;
};

function useBrandLogoSrc(candidates: readonly string[]) {
  const [index, setIndex] = useState(0);
  const src = candidates[Math.min(index, candidates.length - 1)]!;
  const exhausted = index >= candidates.length - 1;

  const onError = () => {
    setIndex((current) => Math.min(current + 1, candidates.length - 1));
  };

  return { src, onError, exhausted };
}

/** Logo image with text fallback — full, compact, or hero layouts. */
export function BrandWordmark({
  className,
  variant = "full",
  showTagline = true,
  showSignature = false,
  showLogo = true,
  tagline = BRAND_TAGLINE,
  titleClassName,
  taglineClassName,
  useGradientTagline = true,
  href,
}: BrandWordmarkProps) {
  const [logoFailed, setLogoFailed] = useState(false);
  const logoCandidates =
    variant === "compact" ? BRAND_LOGO_PATHS.icon : BRAND_LOGO_PATHS.horizontal;
  const { src: logoPath, onError: onLogoError, exhausted: logoExhausted } = useBrandLogoSrc(logoCandidates);
  const showLogoImage = showLogo && !logoFailed;

  const content = (
    <span
      className={cn(
        variant === "hero" ? "flex w-full flex-col" : "inline-flex items-center gap-3",
        className,
      )}
    >
      {showLogoImage ? (
        <Image
          key={logoPath}
          src={logoPath}
          alt=""
          width={variant === "compact" ? 36 : 44}
          height={variant === "compact" ? 36 : 44}
          className={cn(
            "shrink-0 rounded-2xl shadow-[0_12px_34px_rgba(0,0,0,0.28)]",
            variant === "compact" ? "size-9" : "size-11",
          )}
          onError={() => {
            if (logoExhausted) setLogoFailed(true);
            else onLogoError();
          }}
          priority={variant === "hero"}
        />
      ) : showLogo && logoFailed ? (
        <CRMark size={variant === "compact" ? "sm" : "md"} />
      ) : null}
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            "block font-extrabold tracking-tight text-[var(--jb-text)]",
            variant === "hero"
              ? "text-[clamp(40px,10vw,72px)] leading-[0.9] tracking-[-0.06em]"
              : variant === "compact"
                ? "text-sm"
                : "text-xl",
            titleClassName,
          )}
        >
          {BRAND_NAME}
        </span>
        {showTagline ? (
          useGradientTagline ? (
            <GradientText
              className={cn(
                "mt-1 block font-bold tracking-[0.18em] uppercase",
                variant === "hero" ? "text-sm sm:text-base" : "text-xs",
                taglineClassName,
              )}
            >
              {tagline}
            </GradientText>
          ) : (
            <span
              className={cn(
                "mt-1 block text-xs font-bold text-[var(--jb-muted)]",
                taglineClassName,
              )}
            >
              {tagline}
            </span>
          )
        ) : null}
        {showSignature && variant === "hero" ? (
          <p className="mt-2 text-sm font-semibold text-[var(--jb-muted)]">
            Little songs. <span className="text-cr-gradient">♥</span> Big connections.
          </p>
        ) : showSignature ? (
          <p className="mt-0.5 text-[11px] font-semibold text-[var(--jb-muted)]">{BRAND_SIGNATURE}</p>
        ) : null}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
