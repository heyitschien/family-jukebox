import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Keep metadata in <head> for all user-agents.
   * This avoids missing link previews in HTML-limited crawlers/messaging apps.
   */
  htmlLimitedBots: /.*/,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
