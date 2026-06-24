import { readFileSync } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

const LOGO_BYTES = readFileSync(path.join(process.cwd(), "public/brand/logo.png"));

export function GET() {
  return new NextResponse(LOGO_BYTES, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
