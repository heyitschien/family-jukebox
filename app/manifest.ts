import type { MetadataRoute } from "next";

import { buildWebAppManifest } from "@/lib/app-install";

export default function manifest(): MetadataRoute.Manifest {
  return buildWebAppManifest();
}
