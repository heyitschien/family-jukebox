import Image from "next/image";

import { BRAND_NAME, BRAND_TAGLINE, BRAND_LOGO_UI_PATH } from "@/lib/brand";
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
      <Image
        src={BRAND_LOGO_UI_PATH}
        alt=""
        width={44}
        height={44}
        className="size-11 shrink-0 rounded-2xl shadow-[0_12px_34px_rgba(0,0,0,0.28)]"
        priority
      />
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
