import { createAppIconResponse } from "@/lib/app-icon";

export const contentType = "image/png";

export function GET() {
  return createAppIconResponse({ size: 512 });
}
