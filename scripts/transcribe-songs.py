#!/usr/bin/env python3
"""Extract lyrics/transcriptions from song MP3s using faster-whisper."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SONGS_TS = ROOT / "data" / "songs.ts"
OUT = Path(__file__).resolve().parent / "transcripts.json"
LYRICS_TS = ROOT / "data" / "lyrics.ts"

NAME_FIXES = [
    (r"\bMarcellin\b", "Marceline"),
    (r"\bSolane\b", "Solene"),
    (r"\bSelene\b", "Solene"),
    (r"\bIleana\b", "Eliana"),
    (r"\bSillane\b", "Solene"),
    (r"\bTochi\b", "Tio Chien"),
    (r"\bT\.O\.G\.\b", "Tio Chien"),
]

CLEANUPS = [
    (r"^Music\s*\n?", ""),
    (r"^🎵\s*\n?", ""),
    (r"\n🎵\n", "\n"),
]


def polish(text: str) -> str:
    for pattern, repl in NAME_FIXES + CLEANUPS:
        text = re.sub(pattern, repl, text, flags=re.MULTILINE)
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)


def load_catalog() -> list[tuple[str, Path]]:
    """Read slug + audio path pairs from data/songs.ts."""
    text = SONGS_TS.read_text(encoding="utf-8")
    blocks = re.findall(
        r"\{[^{}]*slug:\s*\"([^\"]+)\"[^{}]*audioSrc:\s*\"([^\"]+)\"[^{}]*\}",
        text,
        flags=re.DOTALL,
    )
    catalog: list[tuple[str, Path]] = []
    for slug, audio_src in blocks:
        rel = audio_src.lstrip("/")
        catalog.append((slug, ROOT / "public" / rel))
    return catalog


def load_existing() -> dict[str, dict[str, str | float]]:
    if not OUT.is_file():
        return {}
    return json.loads(OUT.read_text(encoding="utf-8"))


def transcribe_one(model, slug: str, path: Path) -> dict[str, str | float]:
    if not path.is_file():
        raise FileNotFoundError(f"Missing audio for {slug}: {path}")
    print(f"Transcribing {slug}...")
    segments, info = model.transcribe(str(path), language="en", vad_filter=False)
    lyrics = polish("\n".join(s.text.strip() for s in segments if s.text.strip()))
    return {
        "language": info.language,
        "duration": round(info.duration, 1),
        "lyrics": lyrics,
    }


def write_lyrics_ts(results: dict[str, dict[str, str | float]]) -> None:
    lines = [
        "// Auto-generated from scripts/transcripts.json — re-run scripts/transcribe-songs.py to refresh.",
        "",
        "export const songLyrics = {",
    ]
    for slug in sorted(results.keys()):
        escaped = results[slug]["lyrics"].replace("\\", "\\\\").replace("`", "\\`")
        lines.append(f'  "{slug}": `{escaped}`,')
    lines.append("} as const satisfies Record<string, string>;")
    lines.append("")
    LYRICS_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {LYRICS_TS}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Transcribe family jukebox songs")
    parser.add_argument("--model", default="small", help="Whisper model size (default: small)")
    parser.add_argument(
        "--slug",
        action="append",
        dest="slugs",
        help="Transcribe only these song slugs (repeatable). Default: all songs in catalog.",
    )
    parser.add_argument(
        "--missing-only",
        action="store_true",
        help="Only transcribe songs not yet in transcripts.json",
    )
    parser.add_argument(
        "--audio",
        nargs=2,
        metavar=("SLUG", "PATH"),
        action="append",
        dest="audio_overrides",
        help="Transcribe a slug from a specific MP3 path (for songs not yet in songs.ts)",
    )
    args = parser.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print(
            "Install deps: python3 -m venv .venv-transcribe && pip install faster-whisper",
            file=sys.stderr,
        )
        return 1

    catalog = load_catalog()
    if not catalog:
        print(f"No songs found in {SONGS_TS}", file=sys.stderr)
        return 1

    catalog_map = dict(catalog)
    if args.audio_overrides:
        for slug, raw_path in args.audio_overrides:
            catalog_map[slug] = Path(raw_path)
            if not Path(raw_path).is_absolute():
                catalog_map[slug] = ROOT / raw_path

    targets = args.slugs or list(catalog_map.keys())
    if args.missing_only:
        existing = load_existing()
        targets = [slug for slug in targets if slug not in existing or not existing[slug].get("lyrics")]

    if not targets:
        print("Nothing to transcribe.")
        return 0

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    results = load_existing()

    for slug in targets:
        path = catalog_map.get(slug)
        if path is None:
            print(f"Unknown slug (not in songs.ts): {slug}", file=sys.stderr)
            return 1
        results[slug] = transcribe_one(model, slug, path)

    OUT.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    write_lyrics_ts(results)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
