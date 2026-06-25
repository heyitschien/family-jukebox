import type { NextRequest } from "next/server";

function hostFromHeaderValue(value: string | null): string | null {
  if (!value) return null;

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

/** True when Origin or Referer matches the request Host (same-site browser traffic). */
export function isSameSiteApiRequest(request: NextRequest): boolean {
  const host = request.headers.get("host");
  if (!host) return false;

  const originHost = hostFromHeaderValue(request.headers.get("origin"));
  if (originHost) return originHost === host;

  const refererHost = hostFromHeaderValue(request.headers.get("referer"));
  if (refererHost) return refererHost === host;

  return false;
}
