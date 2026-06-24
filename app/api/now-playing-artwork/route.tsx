import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getSongBySlug } from "@/data/songs";
import { BRAND_COLORS, BRAND_SHORT_NAME } from "@/lib/brand";

const DEFAULT_SIZE = 512;
const MIN_SIZE = 128;
const MAX_SIZE = 1024;

function resolveSize(request: Request): number {
  const value = new URL(request.url).searchParams.get("size");
  const parsed = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsed)) return DEFAULT_SIZE;
  if (parsed < MIN_SIZE) return MIN_SIZE;
  if (parsed > MAX_SIZE) return MAX_SIZE;
  return parsed;
}

async function loadCoverDataUrl(coverSrc: string): Promise<string | null> {
  const relative = coverSrc.startsWith("/") ? coverSrc.slice(1) : coverSrc;
  const absolute = path.join(process.cwd(), "public", relative);

  try {
    const buffer = await readFile(absolute);
    const ext = path.extname(relative).toLowerCase();
    const mime =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("song");
  const size = resolveSize(request);

  const song = slug ? getSongBySlug(slug) : undefined;
  const coverDataUrl = song ? await loadCoverDataUrl(song.coverSrc) : null;
  const radius = Math.round(size * 0.08);
  const badgeSize = Math.round(size * 0.16);

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          borderRadius: radius,
          background: BRAND_COLORS.background,
        }}
      >
        {coverDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverDataUrl}
            alt=""
            width={size}
            height={size}
            style={{
              position: "absolute",
              inset: 0,
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(145deg, ${BRAND_COLORS.surface} 0%, ${BRAND_COLORS.surfaceAlt} 55%, ${BRAND_COLORS.accent} 140%)`,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: size * 0.06,
            bottom: size * 0.06,
            width: badgeSize,
            height: badgeSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: Math.round(badgeSize * 0.28),
            background: "rgba(10,14,18,0.72)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: BRAND_COLORS.text,
            fontSize: Math.round(badgeSize * 0.42),
            fontWeight: 900,
            letterSpacing: -1,
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          {BRAND_SHORT_NAME}
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
    },
  );
}
