import { cn } from "@/lib/utils";

type PlayButtonProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  label?: string;
};

const sizes = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
};

const iconSizes = {
  sm: "size-5",
  md: "size-6",
  lg: "size-7",
};

export function PlayButton({ size = "lg", className, onClick, label = "Play" }: PlayButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex items-center justify-center rounded-full bg-family-accent text-[#1a0812] shadow-lg transition hover:scale-105 active:scale-95",
        sizes[size],
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className={cn(iconSizes[size], "ml-0.5 fill-current")}>
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
