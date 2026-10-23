"""Downscale the 3D turntables.

All 223 clips were encoded at 2048x2048 for cards that render at roughly
400-600px — 654 MB, 45% of the whole published site. Fitting them to 960 on
the long edge costs nothing visible and returns about three quarters of that.

Encodes to a temporary file and only then replaces the original, so an
interrupted run never leaves a truncated clip behind. The pre-downscale
versions remain in git history.
"""
import io
import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\Build\App"
TARGET_DIR = os.path.join(ROOT, "public", "assets", "3d Assets")
REPORT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "downscale_3d_report.json")

LONG_EDGE = 960
CRF = "34"


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height", "-of", "json", path],
        capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]


def even(n):
    return n - (n % 2)


def target(w, h):
    """Fit inside LONG_EDGE without upscaling; keep both sides even for yuv420p."""
    if max(w, h) <= LONG_EDGE:
        return None
    scale = LONG_EDGE / max(w, h)
    return even(round(w * scale)), even(round(h * scale))


def shrink(path):
    w, h = probe(path)
    size = target(w, h)
    before = os.path.getsize(path)
    if size is None:
        return {"file": os.path.relpath(path, TARGET_DIR).replace("\\", "/"),
                "skipped": "already within target", "before": before, "after": before}

    tmp = path + ".tmp.webm"
    subprocess.run(
        ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", path,
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", CRF,
         "-deadline", "good", "-cpu-used", "3", "-row-mt", "1",
         "-vf", f"scale={size[0]}:{size[1]}:flags=lanczos", "-an", tmp],
        check=True, stdin=subprocess.DEVNULL)

    after = os.path.getsize(tmp)
    if after == 0:
        os.remove(tmp)
        raise RuntimeError("empty output")
    # Only give up the original once the replacement is known good.
    os.replace(tmp, path)
    return {"file": os.path.relpath(path, TARGET_DIR).replace("\\", "/"),
            "from": f"{w}x{h}", "to": f"{size[0]}x{size[1]}",
            "before": before, "after": after}


def main():
    targets = [os.path.join(dp, f)
               for dp, _, fns in os.walk(TARGET_DIR)
               for f in sorted(fns) if f.endswith(".webm")]
    print(f"{len(targets)} clips", flush=True)

    rows, errors, done = [], [], 0
    with ThreadPoolExecutor(max_workers=4) as pool:
        futs = {pool.submit(shrink, p): p for p in targets}
        for f in as_completed(futs):
            done += 1
            try:
                rows.append(f.result())
            except Exception as exc:
                errors.append((futs[f], repr(exc)))
            if done % 25 == 0 or done == len(targets):
                print(f"  {done}/{len(targets)}", flush=True)

    rows.sort(key=lambda r: r["file"])
    with io.open(REPORT, "w", encoding="utf-8") as fh:
        json.dump(rows, fh, indent=2)

    before = sum(r["before"] for r in rows)
    after = sum(r["after"] for r in rows)
    print(f"\n{before/1e6:.1f} MB -> {after/1e6:.1f} MB  "
          f"(reclaims {(before-after)/1e6:.1f} MB)")
    if errors:
        print(f"{len(errors)} FAILURES:")
        for p, e in errors[:10]:
            print("  ", p, e)
        sys.exit(1)


if __name__ == "__main__":
    main()
