import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/analytics/constants";
import { applySecurityHeaders } from "@/lib/security/headers";
import { isSameSiteApiRequest } from "@/lib/security/origin";

function withSecurityHeaders(response: NextResponse): NextResponse {
  applySecurityHeaders(response.headers);
  return response;
}

function jsonError(status: number, error: string, retryAfterSeconds?: number): NextResponse {
  const response = NextResponse.json({ ok: false, error }, { status });
  if (retryAfterSeconds !== undefined) {
    response.headers.set("Retry-After", String(retryAfterSeconds));
  }
  return withSecurityHeaders(response);
}

export function middleware(request: NextRequest) {
  const response = withSecurityHeaders(NextResponse.next());

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    response.cookies.set(SESSION_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const method = request.method;
    if (method !== "GET" && method !== "HEAD" && !isSameSiteApiRequest(request)) {
      return jsonError(403, "Forbidden origin");
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4|ico)$).*)"],
};
