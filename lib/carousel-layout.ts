export type CarouselRingLayout = {
  coverSize: number;
  radius: number;
  dotSizeClass: string;
  activeDotWidthClass: string;
  maxDotsVisible: number;
};

/**
 * Ring geometry for the 3D album carousel — scales gracefully as the family grows
 * without shrinking the hero cover into illegibility.
 */
export function getCarouselRingLayout(count: number): CarouselRingLayout {
  if (count <= 0) {
    return {
      coverSize: 180,
      radius: 168,
      dotSizeClass: "size-2",
      activeDotWidthClass: "w-5",
      maxDotsVisible: 8,
    };
  }

  const coverSize = Math.round(Math.max(128, Math.min(190, 198 - count * 4.25)));

  const chordRadius = coverSize / (2 * Math.sin(Math.PI / Math.max(count, 3)));
  const radius = Math.round(Math.min(228, Math.max(118, chordRadius + 10)));

  const dotSizeClass = count > 10 ? "size-1.5" : "size-2";
  const activeDotWidthClass = count > 10 ? "w-4" : count > 7 ? "w-4" : "w-5";

  return {
    coverSize,
    radius,
    dotSizeClass,
    activeDotWidthClass,
    maxDotsVisible: count > 12 ? 10 : count,
  };
}
