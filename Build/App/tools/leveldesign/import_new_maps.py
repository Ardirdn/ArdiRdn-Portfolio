"""Import the New/LevelDesign screenshots into the level design gallery.

The sources are Roblox screenshots named <userId>_<placeId>_<timestamp>.png —
one of those place ids (106386957111185) is Mount Nirwana's, so these are
Studio captures from the author's own experiences.

PNG at 2.5-3 MB each is far too heavy to serve; everything is converted to
WebP at the width the rest of the gallery uses.
"""
import io
import json
import os
import re
import subprocess
import sys
import time

SRC_ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\New\LevelDesign"
ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\Build\App"
OUT_ROOT = os.path.join(ROOT, "public", "assets", "leveldesign", "roblox")
DATA = os.path.join(ROOT, "public", "data", "leveldesigns.json")

WIDTH = "1600"
QUALITY = "80"

# source folder -> display title. "Undergwater" is a typo in the folder name.
TITLES = {
    "AgencyBuilding": "Agency Building",
    "FishingVillageLobby": "Fishing Village Lobby",
    "IslandEvent": "Island Event",
    "JapaneseLake": "Japanese Lake",
    "UndergwaterMonument": "Underwater Monument",
}

PLACEHOLDER = "Placeholder — description to be written."


def slug(title):
    return re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")


def to_webp(src, dst):
    if os.path.exists(dst) and os.path.getsize(dst) > 0:
        return
    subprocess.run(
        ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src,
         "-vf", f"scale='min({WIDTH},iw)':-2:flags=lanczos", "-q:v", QUALITY, dst],
        check=True, stdin=subprocess.DEVNULL)


def main():
    raw = io.open(DATA, encoding="utf-8", newline="").read()
    designs = json.loads(raw)
    existing = {d["id"] for d in designs}

    added = []
    for folder, title in TITLES.items():
        did = slug(title)
        if did in existing:
            print(f"  {title}: sudah ada, dilewati")
            continue

        src_dir = os.path.join(SRC_ROOT, folder)
        pngs = sorted(f for f in os.listdir(src_dir) if f.lower().endswith(".png"))
        out_dir = os.path.join(OUT_ROOT, title)
        os.makedirs(out_dir, exist_ok=True)

        names = []
        for i, png in enumerate(pngs, 1):
            name = f"{did}-{i}.webp"
            to_webp(os.path.join(src_dir, png), os.path.join(out_dir, name))
            names.append(name)

        year = time.strftime("%Y", time.localtime(
            os.path.getmtime(os.path.join(src_dir, pngs[0]))))

        designs.append({
            "id": did,
            "title": title,
            "engine": "roblox",
            "style": "Low Poly / Stylized",
            "year": year,
            "description": PLACEHOLDER,
            "folder": f"/assets/leveldesign/roblox/{title}",
            "thumbnail": f"/assets/leveldesign/roblox/{title}/{names[0]}",
            "images": names,
        })
        added.append((title, len(names)))
        print(f"  {title:24s} {len(names)} gambar", flush=True)

    nl = "\r\n" if "\r\n" in raw else "\n"
    tail = "\n" if raw.endswith(("\n", "\r\n")) else ""
    with io.open(DATA, "w", encoding="utf-8", newline=nl) as f:
        json.dump(designs, f, indent=2, ensure_ascii=False)
        f.write(tail)

    total = sum(os.path.getsize(os.path.join(dp, f))
                for t, _ in added
                for dp, _, fs in os.walk(os.path.join(OUT_ROOT, t)) for f in fs)
    print(f"\n{len(added)} map ditambahkan, {total/1e6:.1f} MB webp, "
          f"total sekarang {len(designs)} level design")
    if not added:
        sys.exit(0)


if __name__ == "__main__":
    main()
