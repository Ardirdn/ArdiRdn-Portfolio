"""Build the 1:1 character thumbnails for the Character Skills section.

Licensed anime characters get their portrait from MyAnimeList's character
database (search page -> character page -> cdn.myanimelist.net image).
The original/class characters (Ranger, TankSoldier, ...) have no such entry,
so their thumbnail is pulled from the user's own gameplay capture instead.

Downloads land in their own quarantine directory and are only ever handed to
ffmpeg as path arguments.
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

ROOT = r"D:\Portfolio\ArdiRdn-Portfolio"
SRC_ROOT = os.path.join(ROOT, "CharacterSkills")
OUT_ROOT = os.path.join(ROOT, "Build", "App", "public", "assets", "CharacterSkills")
HERE = os.path.dirname(os.path.abspath(__file__))
DL_DIR = os.path.join(HERE, "downloads_untrusted")
REPORT = os.path.join(HERE, "thumbs_report.json")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
SIZE = 512

# folder -> MyAnimeList search term. None = no licensed counterpart, use gameplay.
MAL_QUERY = {
    "Aizen": "Sousuke Aizen",
    "Android18": "Android 18",
    "BakiHanma": "Baki Hanma",
    "Frieza": "Freeza",
    "Gilgamesh": "Gilgamesh Fate",
    "Gojo": "Satoru Gojou",
    "Goku": "Son Goku",
    "GonFreecss": "Gon Freecss",
    "Ichigo": "Ichigo Kurosaki",
    "Kaguya": "Kaguya Ootsutsuki",
    "Luffy": "Monkey D Luffy",
    "Madara": "Madara Uchiha",
    "Naruto": "Naruto Uzumaki",
    "Natsu": "Natsu Dragneel",
    "Saitama": "Saitama One Punch",
    "Sasuke": "Sasuke Uchiha",
    "Sukuna": "Ryoumen Sukuna",
    "Tanjiro": "Tanjirou Kamado",
    "Vegeta": "Vegeta",
    "Yoriichi": "Yoriichi Tsugikuni",
    "YoujiItadori": "Yuuji Itadori",
    # original / class characters - no licensed portrait exists
    "Ejin": None,
    "Balanced1": None,
    "Balanced2": None,
    "Healer": None,
    "Ranger1": None,
    "Ranger2": None,
    "Ranger3": None,
    "TankSoldier1": None,
    "TankSoldier2": None,
    "TankSoldier3": None,
    "TankSoldier4": None,
}

CHAR_LINK = re.compile(r"https://myanimelist\.net/character/(\d+)/([A-Za-z0-9_%.-]+)")
CDN_IMG = re.compile(r"https://cdn\.myanimelist\.net/images/characters/[^\"' ]+\.(?:jpg|webp|png)")


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def mal_portrait(query, dest):
    """Search MAL, open the top character hit, download its portrait."""
    url = ("https://myanimelist.net/character.php?cat=character&q="
           + urllib.parse.quote(query))
    hit = CHAR_LINK.search(get(url))
    if not hit:
        return None, "no search hit"
    page_url = hit.group(0)
    time.sleep(1.2)
    img = CDN_IMG.search(get(page_url))
    if not img:
        return None, f"no image on {page_url}"
    time.sleep(1.2)
    with open(dest, "wb") as f:
        f.write(get(img.group(0), binary=True))
    return {"mal": page_url, "image": img.group(0)}, None


def square(src, out, y_bias, seek=None):
    """Crop the largest centred square (shifted up by y_bias) and emit WebP."""
    vf = (f"crop=w='min(iw,ih)':h='min(iw,ih)':x='(iw-min(iw,ih))/2'"
          f":y='(ih-min(iw,ih))*{y_bias}',scale={SIZE}:{SIZE}:flags=lanczos")
    cmd = ["ffmpeg", "-nostdin", "-y", "-v", "error"]
    if seek is not None:
        cmd += ["-ss", str(seek)]
    cmd += ["-i", src, "-frames:v", "1", "-vf", vf, "-q:v", "82", out]
    subprocess.run(cmd, check=True, stdin=subprocess.DEVNULL)


def gameplay_frame(char):
    """Fallback thumbnail: a frame from the character's own basic-attack clip."""
    cdir = os.path.join(SRC_ROOT, char)
    for fn in sorted(os.listdir(cdir)):
        if fn.endswith("(front).mp4"):
            return os.path.join(cdir, fn)
    return None


def main():
    os.makedirs(DL_DIR, exist_ok=True)
    report = []

    for char in sorted(MAL_QUERY):
        out = os.path.join(OUT_ROOT, char, "thumb.webp")
        os.makedirs(os.path.dirname(out), exist_ok=True)
        query = MAL_QUERY[char]
        source, err = None, None

        if query:
            raw = os.path.join(DL_DIR, f"{char}.img")
            try:
                source, err = mal_portrait(query, raw)
            except Exception as exc:
                err = repr(exc)
            if source:
                try:
                    # Portraits are tall; bias the square up to keep the face.
                    square(raw, out, 0.12)
                    report.append({"character": char, "origin": "myanimelist", **source})
                    print(f"  {char:14s} MAL  {source['image']}", flush=True)
                    continue
                except subprocess.CalledProcessError as exc:
                    err = f"ffmpeg failed: {exc}"

        clip = gameplay_frame(char)
        if not clip:
            print(f"  {char:14s} FAILED  {err}", flush=True)
            report.append({"character": char, "origin": "none", "error": err})
            continue
        square(clip, out, 0.30, seek=1.0)
        report.append({"character": char, "origin": "gameplay",
                       "note": err or "no licensed counterpart"})
        print(f"  {char:14s} gameplay frame" + (f"  ({err})" if err else ""), flush=True)

    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    ok = sum(1 for r in report if r["origin"] != "none")
    print(f"\n{ok}/{len(report)} thumbnails written to {OUT_ROOT}")
    by = {}
    for r in report:
        by[r["origin"]] = by.get(r["origin"], 0) + 1
    print("sources:", by)
    if ok != len(report):
        sys.exit(1)


if __name__ == "__main__":
    main()
