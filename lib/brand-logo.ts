import { readFileSync } from "node:fs";
import path from "node:path";

let cachedLogoDataUrl: string | null = null;

/** Inline data URL for OG / ImageResponse (Satori cannot read local files directly). */
export function getBrandLogoDataUrl(): string {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  const logoPath = path.join(process.cwd(), "public/brand/logo.png");
  const buffer = readFileSync(logoPath);
  cachedLogoDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
  return cachedLogoDataUrl;
}
