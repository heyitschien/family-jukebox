import { ImageResponse } from "next/og";

import { getSongAuthor, getSongBySlug } from "@/data/songs";

export const alt = "Family Jukebox song preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type SongOgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SongOpengraphImage({ params }: SongOgImageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);
  const author = song ? getSongAuthor(song) : undefined;

  const title = song?.title ?? "Family Jukebox";
  const subtitle = song?.subtitle ?? "Family song preview";
  const byline = author ? `By ${author.name}` : "By Family";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 20% 10%, rgba(255,111,177,0.45), transparent 40%), radial-gradient(circle at 85% 88%, rgba(108,183,255,0.35), transparent 42%), linear-gradient(180deg, #071015 0%, #0b0f14 60%, #07090c 100%)",
          color: "#f7fbff",
          padding: "56px",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "999px",
            border: "1px solid rgba(255,111,177,0.45)",
            background: "rgba(255,111,177,0.2)",
            color: "#ffb8d9",
            fontSize: 28,
            fontWeight: 800,
            padding: "12px 22px",
          }}
        >
          Family Jukebox
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 72, lineHeight: 1.05, fontWeight: 900 }}>{title}</p>
          <p style={{ margin: 0, fontSize: 34, lineHeight: 1.3, color: "#cfd8e3", fontWeight: 600 }}>
            {subtitle}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 28,
            color: "#a7b3c2",
            fontWeight: 700,
          }}
        >
          <span>{byline}</span>
          <span>family-jukebox.vercel.app</span>
        </div>
      </div>
    ),
    size,
  );
}
