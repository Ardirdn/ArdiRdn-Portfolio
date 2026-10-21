"""Transcode Character Skills captures to web assets.

Source : CharacterSkills/<Char>/<Char> - <skill> (<angle>).mp4   (1440p60 h264)
Output : Build/App/public/assets/CharacterSkills/<Char>/<key>-<variant>.webm + .webp

Keeps two camera variants per skill: "front" -> solo, "front, enemy" -> enemy.
Resumable: an existing, non-empty output is skipped.
Writes a manifest the data-file generator reads.
"""
import json
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = r"D:\Portfolio\ArdiRdn-Portfolio"
SRC_ROOT = os.path.join(ROOT, "CharacterSkills")
OUT_ROOT = os.path.join(ROOT, "Build", "App", "public", "assets", "CharacterSkills")
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skills_manifest.json")

# angle in the filename -> variant slug used on disk and in the JSON
VARIANTS = {"front": "solo", "front, enemy": "enemy"}

CRF = "33"
HEIGHT = "720"
POSTER_AT = 0.45  # fraction of duration; the VFX peak usually sits mid-clip
POSTER_WIDTH = "1280"

# Original 32 characters: "<Char> - <skill> (<angle>).mp4", six angles each.
NAME_RE = re.compile(r"^(?P<char>.*?) - (?P<skill>.*?) \((?P<angle>[^)]*)\)\.mp4$")
# Characters added later: "<Char>_<SkillName>.mp4" - one long clip, no angles.
FLAT_RE = re.compile(r"^(?P<char>[A-Za-z0-9]+)_(?P<skill>[A-Za-z0-9]+)\.mp4$")


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "format=duration", "-show_entries", "stream=width,height",
         "-of", "json", path],
        capture_output=True, text=True).stdout
    j = json.loads(out)
    return float(j["format"]["duration"]), j["streams"][0]["width"], j["streams"][0]["height"]


def encode(src, dst, duration):
    """webm + sibling webp poster. Returns True when it actually ran ffmpeg."""
    did = False
    if not (os.path.exists(dst) and os.path.getsize(dst) > 0):
        subprocess.run(
            ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src,
             "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", CRF,
             "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-r", "30",
             "-vf", f"scale=-2:{HEIGHT}", "-c:a", "libopus", "-b:a", "128k", dst],
            check=True, stdin=subprocess.DEVNULL)
        did = True

    poster = dst[:-5] + ".webp"
    if not (os.path.exists(poster) and os.path.getsize(poster) > 0):
        subprocess.run(
            ["ffmpeg", "-nostdin", "-y", "-v", "error",
             "-ss", f"{duration * POSTER_AT:.3f}", "-i", src, "-frames:v", "1",
             "-vf", f"scale={POSTER_WIDTH}:-2", "-q:v", "80", poster],
            check=True, stdin=subprocess.DEVNULL)
        did = True
    return did


# Featured cards autoplay on the landing page, and the clips below run 14-48s
# and weigh 3-18 MB each. Every one listed here also gets a short, cheaper
# "-preview.webm"; the character's own page always plays the full clip.
PREVIEWS = {
    ("Emilia", "icering"),
    ("Emilia", "iceslam"),
    ("SteroidMan", "groundrapture"),
    ("SteroidMan", "venomrush"),
}
PREVIEW_SECONDS = "6"
PREVIEW_CRF = "36"


def make_preview(src, dst):
    """Short, lower-bitrate cut used only by a featured card."""
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return
    subprocess.run(
        ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src, "-t", PREVIEW_SECONDS,
         "-c:v", "libvpx-vp9", "-pix_fmt", "yuv420p", "-b:v", "0", "-crf", PREVIEW_CRF,
         "-deadline", "good", "-cpu-used", "4", "-row-mt", "1", "-r", "30",
         "-vf", f"scale=-2:{HEIGHT}", "-an", dst],
        check=True, stdin=subprocess.DEVNULL)
    poster = dst[:-5] + ".webp"
    if not (os.path.exists(poster) and os.path.getsize(poster) > 0):
        subprocess.run(
            ["ffmpeg", "-nostdin", "-y", "-v", "error", "-ss", "2", "-i", src,
             "-frames:v", "1", "-vf", f"scale={POSTER_WIDTH}:-2", "-q:v", "80", poster],
            check=True, stdin=subprocess.DEVNULL)


def collect():
    jobs, skills, oddities = [], {}, []
    for char in sorted(os.listdir(SRC_ROOT)):
        cdir = os.path.join(SRC_ROOT, char)
        if char.startswith("_") or not os.path.isdir(cdir):
            continue
        for fn in sorted(os.listdir(cdir)):
            if not fn.lower().endswith(".mp4"):
                continue

            m = NAME_RE.match(fn)
            if m:
                if m.group("angle") not in VARIANTS:
                    continue
                skill = m.group("skill")
                key = skill.split(" ", 1)[0]
                name = skill.split(" ", 1)[1] if " " in skill else skill
                variant = VARIANTS[m.group("angle")]
            else:
                f = FLAT_RE.match(fn)
                if not f:
                    oddities.append(("unparsed", char, fn))
                    continue
                # The folder decides whose skill this is; every folder here is
                # one character. A prefix that disagrees is worth reporting.
                if f.group("char").lower() != char.lower():
                    oddities.append(("prefix", char, fn))
                name = f.group("skill")
                key = re.sub(r"[^a-z0-9]", "", name.lower())
                variant = "full"

            src = os.path.join(cdir, fn)
            dst = os.path.join(OUT_ROOT, char, f"{key}-{variant}.webm")
            jobs.append((src, dst))
            skills.setdefault((char, key), {"key": key, "raw": name, "variants": {}})
            skills[(char, key)]["variants"][variant] = dst
    return jobs, skills, oddities


def main():
    jobs, skills, oddities = collect()
    for kind, char, fn in oddities:
        label = "UNPARSED" if kind == "unparsed" else "PREFIX MISMATCH"
        print(f"  !! {label}: {char}/{fn}", flush=True)
    os.makedirs(OUT_ROOT, exist_ok=True)
    for char in {os.path.basename(os.path.dirname(d)) for _, d in jobs}:
        os.makedirs(os.path.join(OUT_ROOT, char), exist_ok=True)

    print(f"{len(jobs)} clips to process ({len(skills)} skills)", flush=True)

    durations = {}
    with ThreadPoolExecutor(max_workers=6) as pool:
        futs = {pool.submit(probe, s): s for s, _ in jobs}
        for f in as_completed(futs):
            durations[futs[f]] = f.result()[0]
    print("probed all sources", flush=True)

    done = 0
    errors = []
    with ThreadPoolExecutor(max_workers=5) as pool:
        futs = {pool.submit(encode, s, d, durations[s]): (s, d) for s, d in jobs}
        for f in as_completed(futs):
            s, d = futs[f]
            done += 1
            try:
                f.result()
            except Exception as exc:  # keep going; report at the end
                errors.append((s, repr(exc)))
            if done % 20 == 0 or done == len(jobs):
                print(f"  {done}/{len(jobs)}", flush=True)

    for (char, key) in sorted(PREVIEWS):
        rec = skills.get((char, key))
        if not rec:
            print(f"  !! PREVIEW TARGET MISSING: {char}/{key}", flush=True)
            continue
        full_dst = next(iter(rec["variants"].values()))
        src = next(s for s, d in jobs if d == full_dst)
        make_preview(src, os.path.join(OUT_ROOT, char, f"{key}-preview.webm"))
        rec["variants"]["preview"] = os.path.join(OUT_ROOT, char, f"{key}-preview.webm")
        print(f"  preview: {char}/{key}", flush=True)

    out = []
    for (char, key), rec in sorted(skills.items()):
        entry = {"character": char, "key": key, "rawName": rec["raw"], "variants": {}}
        for variant, dst in rec["variants"].items():
            if not os.path.exists(dst):
                continue
            # A preview is cut from the full clip, so it has no job of its own.
            if variant == "preview":
                seconds = float(PREVIEW_SECONDS)
            else:
                seconds = durations[next(s for s, d in jobs if d == dst)]
            entry["variants"][variant] = {
                "webm": os.path.relpath(dst, OUT_ROOT).replace("\\", "/"),
                "bytes": os.path.getsize(dst),
                "duration": round(seconds, 2),
            }
        out.append(entry)

    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)

    total = sum(v["bytes"] for e in out for v in e["variants"].values())
    posters = sum(os.path.getsize(os.path.join(dp, fn))
                  for dp, _, fns in os.walk(OUT_ROOT) for fn in fns if fn.endswith(".webp"))
    print(f"\nDONE  webm {total/1e6:.1f} MB + posters {posters/1e6:.1f} MB "
          f"= {(total+posters)/1e6:.1f} MB")
    if errors:
        print(f"{len(errors)} FAILURES:")
        for s, e in errors[:20]:
            print("  ", s, e)
        sys.exit(1)


if __name__ == "__main__":
    main()
