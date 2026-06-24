import { readFileSync } from "node:fs";
import path from "node:path";

import { BRAND_APP_ICON_PATH, BRAND_LOGO_PATH } from "@/lib/brand";

let cachedLogoDataUrl: string | null = null;
let cachedAppIconDataUrl: string | null = null;

function readPublicAsset(publicPath: string): Buffer {
  const relativePath = publicPath.replace(/^\//, "");
  return readFileSync(path.join(process.cwd(), "public", relativePath));
}

/** Inline data URL for OG cards — full logo mark. */
export function getBrandLogoDataUrl(): string {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  const buffer = readPublicAsset(BRAND_LOGO_PATH);
  cachedLogoDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
  return cachedLogoDataUrl;
}

/** Inline data URL for install / PWA / media-session artwork. */
export function getBrandAppIconDataUrl(): string {
  if (cachedAppIconDataUrl) return cachedAppIconDataUrl;

  const buffer = readPublicAsset(BRAND_APP_ICON_PATH);
  cachedAppIconDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
  return cachedAppIconDataUrl;
}
