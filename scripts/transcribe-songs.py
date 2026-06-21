#!/usr/bin/env python3
"""Extract lyrics/transcriptions from song MP3s using faster-whisper."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "public" / "assets"
OUT = Path(__file__).resolve().parent / "transcripts.json"

SONGS: list[tuple[str, Path]] = [
    ("gravity-shift", ASSETS / "ocean/gravity-shift.mp3"),
    ("mountains-to-the-shore", ASSETS / "ocean/mountains-to-the-shore.mp3"),
    ("dash-and-go", ASSETS / "marceline/dash-and-go.mp3"),
    ("pink-glasses-everywhere", ASSETS / "eliana/pink-glasses-everywhere.mp3"),
    ("foxes-of-the-garden", ASSETS / "solene/foxes-of-the-garden.mp3"),
    ("solene-s-painted-trail", ASSETS / "solene/solenes-painted-trail.mp3"),
    ("pixels-into-magic", ASSETS / "tio-chien/pixels-into-magic.mp3"),
    ("crayon-planets", ASSETS / "tio-chien/crayon-planets.mp3"),
]

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


def main() -> int:
    parser = argparse.ArgumentParser(description="Transcribe family jukebox songs")
    parser.add_argument("--model", default="small", help="Whisper model size (default: small)")
    args = parser.parse_args()

    try:
        from faster_whisper import WhisperModel
    except ImportError:
        print("Install deps: python3 -m venv .venv-transcribe && pip install faster-whisper", file=sys.stderr)
        return 1

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    results: dict[str, dict[str, str | float]] = {}

    for slug, path in SONGS:
        if not path.is_file():
            print(f"Missing: {path}", file=sys.stderr)
            return 1
        print(f"Transcribing {slug}...")
        segments, info = model.transcribe(str(path), language="en", vad_filter=False)
        lyrics = polish("\n".join(s.text.strip() for s in segments if s.text.strip()))
        results[slug] = {
            "language": info.language,
            "duration": round(info.duration, 1),
            "lyrics": lyrics,
        }

    OUT.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote {OUT}")

    lyrics_out = ROOT / "data" / "lyrics.ts"
    lines = [
        "// Auto-generated from scripts/transcripts.json — re-run scripts/transcribe-songs.py to refresh.",
        "",
        "export const songLyrics = {",
    ]
    for slug, item in results.items():
        escaped = item["lyrics"].replace("\\", "\\\\").replace("`", "\\`")
        lines.append(f'  "{slug}": `{escaped}`,')
    lines.append("} as const satisfies Record<string, string>;")
    lines.append("")
    lyrics_out.write_text("\n".join(lines))
    print(f"Wrote {lyrics_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
