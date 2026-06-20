import { PlayIconButton } from "@/components/play-icon-button";

type PlayButtonProps = {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
  label?: string;
};

/** @deprecated Use PlayIconButton — kept for member page */
export function PlayButton({ size = "lg", className, onClick, label = "Play" }: PlayButtonProps) {
  return (
    <PlayIconButton size={size} className={className} onClick={onClick} label={label} />
  );
}
