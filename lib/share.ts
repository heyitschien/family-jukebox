import { SITE_NAME, SITE_URL } from "@/lib/site-metadata";

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

export function buildPublicUrl(path: string): string {
  const base =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : SITE_URL;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalizedPath}`;
}

export async function sharePublicLink(options: {
  title: string;
  path: string;
  text?: string;
}): Promise<ShareResult> {
  const url = buildPublicUrl(options.path);
  const shareTitle = options.title.includes(SITE_NAME)
    ? options.title
    : `${options.title} · ${SITE_NAME}`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: shareTitle,
        text: options.text,
        url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return "copied";
    } catch {
      return "failed";
    }
  }

  return "failed";
}
