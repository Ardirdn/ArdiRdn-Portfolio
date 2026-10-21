"""Transcode the system / mechanic showcase videos for the portfolio.

Source is the author's own YouTube uploads (channels "Ardi Rudini" and
"Trimatra"), pulled down with yt-dlp into a quarantine folder — the site serves
its own copies rather than embedding a player.

Each video produces three files:
  <slug>.webm          the full showcase, played in the lightbox
  <slug>-preview.webm  a short, cheap cut — the only thing a card autoplays
  <slug>.webp          poster frame

These run 27s to nearly 4 minutes, so a grid of cards autoplaying the full
clips would be the heaviest thing on the page. Hence the preview.
"""
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\Build\App"
OUT_ROOT = os.path.join(ROOT, "public", "assets", "Systems")
MANIFEST = os.path.join(HERE, "systems_manifest.json")

# Raw Studio captures compress better than the YouTube re-encodes this started
# with, so they hold up at a lower CRF than those needed.
# These are 27s-to-4min screen recordings of gameplay, already once through
# YouTube's encoder. CRF 34 put the set at 249 MB (one 155s driving clip alone
# was 97 MB), which this site cannot afford. CRF 41 at 720p holds up: the
# camera moves a lot but the UI text in the catalogue and gun demos stays
# readable, which 540p did not manage.
CRF = "38"
HEIGHT = "720"
# Cards only ever autoplay the preview, and a card is ~400-600px wide, so the
# preview is half-height and cheaper still.
PREVIEW_SECONDS = "6"
PREVIEW_CRF = "42"
PREVIEW_HEIGHT = "540"
POSTER_WIDTH = "1280"
POSTER_AT = 0.35


def slugify(name):
    """Source filenames are inconsistent ("Seasonpass  Battlepass System",
    "AdvancedTradeSystemWIthChat"); the slug only has to be stable and safe."""
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", name.lower())).strip("-")


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "format=duration", "-show_entries", "stream=width,height",
         "-of", "json", path], capture_output=True, text=True).stdout
    j = json.loads(out)
    return float(j["format"]["duration"]), j["streams"][0]["width"], j["streams"][0]["height"]


def run(cmd):
    subprocess.run(cmd, check=True, stdin=subprocess.DEVNULL)


def encode(slug, src):
    duration, _, _ = probe(src)
    full = os.path.join(OUT_ROOT, f"{slug}.webm")
    preview = os.path.join(OUT_ROOT, f"{slug}-preview.webm")
    poster = os.path.join(OUT_ROOT, f"{slug}.webp")

    if not (os.path.exists(full) and os.path.getsize(full) > 0):
        run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src,
             "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", CRF,
             "-deadline", "good", "-cpu-used", "3", "-row-mt", "1", "-r", "30",
             "-vf", f"scale=-2:{HEIGHT}", "-c:a", "libopus", "-b:a", "96k", full])

    if not (os.path.exists(preview) and os.path.getsize(preview) > 0):
        # Skip the intro card most of these open on.
        start = min(5.0, duration * 0.08)
        run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-ss", f"{start:.2f}",
             "-i", src, "-t", PREVIEW_SECONDS,
             "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", PREVIEW_CRF,
             "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-r", "30",
             "-vf", f"scale=-2:{PREVIEW_HEIGHT}", "-an", preview])

    if not (os.path.exists(poster) and os.path.getsize(poster) > 0):
        run(["ffmpeg", "-nostdin", "-y", "-v", "error",
             "-ss", f"{duration * POSTER_AT:.2f}", "-i", src, "-frames:v", "1",
             "-vf", f"scale={POSTER_WIDTH}:-2", "-q:v", "80", poster])

    return {
        "slug": slug,
        "duration": round(duration, 2),
        "bytes": os.path.getsize(full),
        "previewBytes": os.path.getsize(preview),
    }


def main(dl_dir):
    os.makedirs(OUT_ROOT, exist_ok=True)
    jobs = [(slugify(os.path.splitext(f)[0]), os.path.join(dl_dir, f))
            for f in sorted(os.listdir(dl_dir)) if f.lower().endswith(".mp4")]
    print(f"{len(jobs)} videos", flush=True)

    results, errors = [], []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(encode, slug, src): slug for slug, src in jobs}
        for f in as_completed(futs):
            try:
                r = f.result()
                results.append(r)
                print(f"  {r['slug']:24s} {r['duration']:6.1f}s  "
                      f"full {r['bytes']/1e6:5.1f} MB  preview {r['previewBytes']/1e6:4.2f} MB",
                      flush=True)
            except Exception as exc:
                errors.append((futs[f], repr(exc)))

    if os.path.exists(MANIFEST):
        with open(MANIFEST, encoding="utf-8") as fh:
            previous = {r["slug"]: r for r in json.load(fh)}
    else:
        previous = {}
    previous.update({r["slug"]: r for r in results})
    results = sorted(previous.values(), key=lambda r: r["slug"])
    with open(MANIFEST, "w", encoding="utf-8") as fh:
        json.dump(results, fh, indent=2)

    tot = sum(r["bytes"] for r in results) + sum(r["previewBytes"] for r in results)
    posters = sum(os.path.getsize(os.path.join(OUT_ROOT, f))
                  for f in os.listdir(OUT_ROOT) if f.endswith(".webp"))
    print(f"\nDONE  {(tot + posters)/1e6:.1f} MB total")
    if errors:
        for slug, e in errors:
            print("  FAILED", slug, e)
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1])
