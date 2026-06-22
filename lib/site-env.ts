export type AppEnvironment = "production" | "staging" | "development";

export const PRODUCTION_SITE_URL = "https://cousinradio.com";

export const STAGING_SITE_URL = "https://staging.cousinradio.com";

/** Legacy Vercel hostname — may redirect; do not use in new code or docs. */
export const LEGACY_VERCEL_SITE_URL = "https://family-jukebox.vercel.app";

function readConfiguredEnvironment(): AppEnvironment | undefined {
  const configured = process.env.NEXT_PUBLIC_APP_ENV;
  if (configured === "staging" || configured === "production" || configured === "development") {
    return configured;
  }
  return undefined;
}

/** Runtime environment — set NEXT_PUBLIC_APP_ENV=staging on preview deploys. */
export function getAppEnvironment(): AppEnvironment {
  const configured = readConfiguredEnvironment();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return "development";
  if (process.env.VERCEL_ENV === "preview") return "staging";
  return "production";
}

export function isStagingEnvironment(): boolean {
  return getAppEnvironment() === "staging";
}

/** Canonical URL for metadata, OG tags, and share links in this deploy. */
export function getRuntimeSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (isStagingEnvironment() && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_URL) {
    return PRODUCTION_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return PRODUCTION_SITE_URL;
}

export function getSiteName(): string {
  return isStagingEnvironment() ? "Family Jukebox · Staging" : "Family Jukebox";
}

export function getSiteDescription(): string {
  if (!isStagingEnvironment()) {
    return "Songs we made together — silly fox trails, pink glasses, gravity shifts, and little family anthems.";
  }
  return "Staging preview — test new songs and layout changes before they go live on cousinradio.com.";
}

export const STAGING_BRAND = {
  label: "Staging preview",
  tagline: "Not production — preview for staging.cousinradio.com",
  badge: "STAGING",
} as const;
