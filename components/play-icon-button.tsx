import { cn } from "@/lib/utils";

type PlayIconButtonProps = {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "accent" | "light" | "dark";
  className?: string;
  onClick?: () => void;
  label?: string;
  playing?: boolean;
};

const sizeClasses = {
  sm: "size-11 min-h-11 min-w-11",
  md: "size-12 min-h-12 min-w-12",
  lg: "size-14 min-h-14 min-w-14",
  xl: "size-[62px] min-h-[62px] min-w-[62px]",
};

const iconSizes = {
  sm: "size-5",
  md: "size-5",
  lg: "size-7",
  xl: "size-8",
};

const variantClasses = {
  accent: "bg-family-accent text-[#1a0812] shadow-family",
  light: "bg-[var(--jb-text)] text-[#050608] shadow-md",
  dark: "bg-[#282828] text-white shadow-md",
};

function PlayTriangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M8 5.14v13.72c0 .79.87 1.27 1.54.84l11.14-6.86c.6-.37.6-1.25 0-1.62L9.54 4.3A1 1 0 0 0 8 5.14z" fill="currentColor" />
    </svg>
  );
}

function PauseBars({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" fill="currentColor" />
    </svg>
  );
}

/** iOS-safe circular play/pause — inline SVG, flex centering, 44px+ touch targets */
export function PlayIconButton({
  size = "lg",
  variant = "accent",
  className,
  onClick,
  label = "Play",
  playing = false,
}: PlayIconButtonProps) {
  const iconClass = cn(iconSizes[size], playing ? "" : "translate-x-[1px]");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={playing ? "Pause" : label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "appearance-none border-0 p-0 outline-none",
        "[-webkit-tap-highlight-color:transparent] [touch-action:manipulation]",
        "transition-transform active:scale-95",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {playing ? <PauseBars className={iconClass} /> : <PlayTriangle className={iconClass} />}
    </button>
  );
}
