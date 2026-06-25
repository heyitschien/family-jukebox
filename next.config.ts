import type { NextConfig } from "next";

import { CONTENT_SECURITY_POLICY, SECURITY_HEADERS } from "@/lib/security/headers";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          ...Object.entries(SECURITY_HEADERS).map(([key, value]) => ({ key, value })),
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
