import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/analytics/constants";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "on",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export function middleware(request: NextRequest) {
  const response = applySecurityHeaders(NextResponse.next());

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
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (request.method !== "GET" && request.method !== "HEAD" && origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return applySecurityHeaders(
            NextResponse.json({ ok: false, error: "Forbidden origin" }, { status: 403 }),
          );
        }
      } catch {
        return applySecurityHeaders(
          NextResponse.json({ ok: false, error: "Forbidden origin" }, { status: 403 }),
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|mp4|ico)$).*)"],
};
