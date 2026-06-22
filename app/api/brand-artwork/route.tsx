import { ImageResponse } from "next/og";

import { BrandMark } from "@/lib/brand-image";

const DEFAULT_SIZE = 512;
const MIN_SIZE = 128;
const MAX_SIZE = 1024;

function resolveSize(request: Request): number {
  const value = new URL(request.url).searchParams.get("size");
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) return DEFAULT_SIZE;
  if (parsed < MIN_SIZE) return MIN_SIZE;
  if (parsed > MAX_SIZE) return MAX_SIZE;
  return parsed;
}

export function GET(request: Request) {
  const size = resolveSize(request);

  return new ImageResponse(<BrandMark size={size} />, {
    width: size,
    height: size,
  });
}
