import type { MetadataRoute } from "next";

import { isStagingEnvironment } from "@/lib/site-env";
import { SITE_URL } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  if (isStagingEnvironment()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
