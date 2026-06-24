import { BRAND_SHORT_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

type CRMarkProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showRings?: boolean;
};

const sizeMap = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-11 text-sm",
};

/** Compact CR mark with optional radio arc rings — SVG fallback until final logo ships. */
export function CRMark({ className, size = "md", showRings = true }: CRMarkProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-2xl",
        sizeMap[size],
        className,
      )}
      aria-hidden
    >
      {showRings ? (
        <svg
          className="pointer-events-none absolute inset-[-18%] size-[136%] opacity-70"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="28" stroke="url(#cr-ring-a)" strokeWidth="1.5" opacity="0.55" />
          <circle cx="32" cy="32" r="22" stroke="url(#cr-ring-b)" strokeWidth="1.25" opacity="0.45" />
          <defs>
            <linearGradient id="cr-ring-a" x1="8" y1="8" x2="56" y2="56">
              <stop stopColor="var(--cr-pink)" />
              <stop offset="0.5" stopColor="var(--cr-lilac)" />
              <stop offset="1" stopColor="var(--cr-ocean)" />
            </linearGradient>
            <linearGradient id="cr-ring-b" x1="56" y1="8" x2="8" y2="56">
              <stop stopColor="var(--cr-ocean)" />
              <stop offset="0.5" stopColor="var(--cr-lilac)" />
              <stop offset="1" stopColor="var(--cr-pink)" />
            </linearGradient>
          </defs>
        </svg>
      ) : null}
      <span className="relative z-10 inline-flex size-full items-center justify-center rounded-2xl bg-cr-gradient font-black text-[#1a0812] shadow-family">
        {BRAND_SHORT_NAME}
      </span>
    </span>
  );
}
