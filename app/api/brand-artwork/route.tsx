import { readFileSync } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { BRAND_APP_ICON_PATH } from "@/lib/brand";

const APP_ICON_BYTES = readFileSync(
  path.join(process.cwd(), "public", BRAND_APP_ICON_PATH.replace(/^\//, "")),
);

export function GET() {
  return new NextResponse(APP_ICON_BYTES, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
