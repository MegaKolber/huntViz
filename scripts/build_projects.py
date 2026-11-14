#!/usr/bin/env python3
"""Build the portfolio catalog from projects/<category>/<slug>/info.md.
Uses only Python's standard library. Run: python3 scripts/build_projects.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATEGORIES = ("films", "fabs", "interacts")
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
VIDEO_EXTS = {".mp4", ".webm"}
MEDIA_EXTS = IMAGE_EXTS | VIDEO_EXTS

def read_info(path):
    raw = path.read_text(encoding="utf-8").strip()
    if not raw.startswith("---\n"):
        raise ValueError(f"{path}: start with --- and a few title/year fields")
    parts = raw.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"{path}: missing closing ---")
    meta = {}
    for line in parts[1].strip().splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError(f"{path}: expected 'key: value' in '{line}'")
        key, value = line.split(":", 1)
        meta[key.strip()] = value.strip().strip('"').strip("'")
    if not meta.get("title"):
        raise ValueError(f"{path}: title is required")
    return meta, parts[2].strip()

def build():
    projects = []
    for category in CATEGORIES:
        directory = ROOT / "projects" / category
        if not directory.exists():
            continue
        for folder in sorted(directory.iterdir()):
            if not folder.is_dir() or folder.name.startswith("."):
                continue
            info = folder / "info.md"
            if not info.is_file():
                raise ValueError(f"{folder}: add an info.md file")
            meta, description = read_info(info)
            media = [f for f in sorted(folder.iterdir()) if f.is_file() and f.suffix.lower() in MEDIA_EXTS]
            cover = meta.get("cover", "")
            if cover and not (folder / cover).is_file():
                raise ValueError(f"{info}: cover '{cover}' was not found")
            if not cover:
                images = [f for f in media if f.suffix.lower() in IMAGE_EXTS]
                cover = images[0].name if images else ""
            base = folder.relative_to(ROOT).as_posix()
            projects.append({
                "id": f"{category}/{folder.name}",
                "category": category,
                "title": meta["title"],
                "year": meta.get("year", ""),
                "cover": f"{base}/{cover}" if cover else "",
                "description": description,
                "media": [{"src": f"{base}/{f.name}", "type": "video" if f.suffix.lower() in VIDEO_EXTS else "image"} for f in media],
            })
    projects.sort(key=lambda p: (p["year"], p["title"].lower()), reverse=True)
    output = ROOT / "projects.json"
    output.write_text(json.dumps(projects, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Built {output.name}: {len(projects)} projects")

if __name__ == "__main__":
    build()
