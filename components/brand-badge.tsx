import { BrandWordmark } from "@/components/brand/brand-wordmark";
import { BRAND_TAGLINE } from "@/lib/brand";

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
  const isCustomSubtitle = subtitle !== BRAND_TAGLINE;

  return (
    <BrandWordmark
      className={className}
      variant="full"
      showTagline={showSubtitle}
      tagline={subtitle}
      titleClassName={titleClassName}
      taglineClassName={subtitleClassName}
      useGradientTagline={!isCustomSubtitle}
    />
  );
}
