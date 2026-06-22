import { BRAND_NAME, BRAND_SHORT_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandBadgeProps = {
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  showSubtitle?: boolean;
  subtitle?: string;
};

export function BrandBadge({
  className,
  titleClassName,
  subtitleClassName,
  showSubtitle = true,
  subtitle = BRAND_TAGLINE,
}: BrandBadgeProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,#111827_0%,#1a0812_58%,#ff6fb1_140%)] text-white shadow-[0_12px_34px_rgba(0,0,0,0.28)]">
        <span className="absolute inset-[3px] rounded-[13px] border border-white/10" aria-hidden />
        <span className="text-[15px] leading-none font-black tracking-[-0.14em]">{BRAND_SHORT_NAME}</span>
        <span
          className="absolute right-1.5 top-1.5 size-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(255,209,102,0.6)]"
          aria-hidden
        />
      </span>
      <span className="leading-tight">
        <span className={cn("block text-xl font-extrabold tracking-tight", titleClassName)}>
          {BRAND_NAME}
        </span>
        {showSubtitle ? (
          <span className={cn("block text-xs text-[var(--jb-muted)]", subtitleClassName)}>{subtitle}</span>
        ) : null}
      </span>
    </span>
  );
}
