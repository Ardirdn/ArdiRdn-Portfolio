"""Convert the mp4 left over from before the site moved to webm.

228 MB of the published site was still raw mp4 — the ModularCharacterShowcase
clips, the unreferenced `system/` demos, and two small gameplay captures. The
site is over GitHub Pages' 1 GB ceiling, and this is the cheapest space back.

Same recipe as the rest of the showcase media: VP9 720p30, CRF 33, Opus audio.
Writes the webm beside the mp4; removal of the originals is a separate step so
the conversion can be checked first.
"""
import io
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\Build\App"
ASSETS = os.path.join(ROOT, "public", "assets")
REPORT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "legacy_report.json")

CRF = "33"
HEIGHT = "720"


def has_audio(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
         "stream=codec_name", "-of", "csv=p=0", path],
        capture_output=True, text=True).stdout.strip()
    return bool(out)


def convert(src):
    dst = src[:-4] + ".webm"
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return src, dst, os.path.getsize(src), os.path.getsize(dst)

    cmd = ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src,
           "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", CRF,
           "-deadline", "good", "-cpu-used", "3", "-row-mt", "1", "-r", "30",
           # Never upscale: several of these are already below 720.
           "-vf", f"scale=-2:'min({HEIGHT},ih)'"]
    cmd += ["-c:a", "libopus", "-b:a", "96k"] if has_audio(src) else ["-an"]
    cmd += [dst]
    subprocess.run(cmd, check=True, stdin=subprocess.DEVNULL)
    return src, dst, os.path.getsize(src), os.path.getsize(dst)


def main():
    sources = [os.path.join(dp, f)
               for dp, _, fns in os.walk(ASSETS)
               for f in sorted(fns) if f.endswith(".mp4")]
    print(f"{len(sources)} mp4 to convert", flush=True)

    rows, errors = [], []
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(convert, s): s for s in sources}
        for f in as_completed(futs):
            try:
                src, dst, a, b = f.result()
                rows.append({"mp4": os.path.relpath(src, ASSETS).replace("\\", "/"),
                             "webm": os.path.relpath(dst, ASSETS).replace("\\", "/"),
                             "before": a, "after": b})
                print(f"  {os.path.basename(src):42s} {a/1e6:6.1f} -> {b/1e6:5.1f} MB",
                      flush=True)
            except Exception as exc:
                errors.append((futs[f], repr(exc)))

    rows.sort(key=lambda r: r["mp4"])
    with io.open(REPORT, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)

    before = sum(r["before"] for r in rows)
    after = sum(r["after"] for r in rows)
    print(f"\n{before/1e6:.1f} MB -> {after/1e6:.1f} MB "
          f"(reclaims {(before-after)/1e6:.1f} MB once the mp4 are removed)")
    if errors:
        for s, e in errors:
            print("  FAILED", s, e)
        sys.exit(1)


if __name__ == "__main__":
    main()
