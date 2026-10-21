"""Turn the scraped Roblox titles into portfolio entries.

Downloads each title's art into a quarantine folder, converts it to WebP at the
size the portfolio uses elsewhere, and appends entries to projects.json.

Fields the studio site does not carry - the user's personal Role, TechStack,
Downloads, MonthDeveloped - are left empty on purpose rather than guessed. The
detail page already renders those as a placeholder.
"""
import io
import json
import os
import re
import subprocess
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SCRAPED = os.path.join(HERE, "trimatra", "roblox_scraped.json")
DL = os.path.join(HERE, "trimatra", "media_untrusted")
ROOT = r"D:\Portfolio\ArdiRdn-Portfolio\Build\App"
ASSETS = os.path.join(ROOT, "public", "assets", "game")
PROJECTS = os.path.join(ROOT, "public", "data", "projects.json")
BASE = "https://www.trimatra.io"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# slug -> the id the portfolio will use (matches the PascalCase ids already there)
IDS = {
    "steal-animegirl": "StealAnAnimeGirl",
    "steal-sneakers": "StealASneakers",
    "steal-army": "StealAnArmy",
    "throw-my-ride": "ThrowMyRide",
    "mount-kalcer": "MountKalcer",
    "quarantine-brainrot": "QuarantineABrainrot",
    "partyclub": "BeachParty",
    "speedlimitsim": "SpeedLimitSim",
    "mancing-mania": "MancingMania",
    "bungee-jump": "BungeeJump",
}

WIDTH = 1280


def fetch(url, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    time.sleep(0.3)


def to_webp(src, dest):
    subprocess.run(
        ["ffmpeg", "-nostdin", "-y", "-v", "error", "-i", src,
         "-vf", f"scale='min({WIDTH},iw)':-2:flags=lanczos", "-q:v", "80", dest],
        check=True, stdin=subprocess.DEVNULL)


def main():
    os.makedirs(DL, exist_ok=True)
    scraped = {s["slug"]: s for s in json.load(io.open(SCRAPED, encoding="utf-8"))}

    raw = io.open(PROJECTS, encoding="utf-8", newline="").read()
    projects = json.loads(raw)
    existing = {p["id"] for p in projects}
    order = min(p.get("Order", 9999) for p in projects) - 1

    added = []
    for slug, pid in IDS.items():
        if pid in existing:
            print(f"  {pid}: sudah ada, dilewati")
            continue
        s = scraped[slug]
        outdir = os.path.join(ASSETS, pid)
        os.makedirs(outdir, exist_ok=True)

        shots = []
        sources = ([s["header"]] if s["header"] else []) + s["screenshots"]
        for i, path in enumerate(sources):
            ext = os.path.splitext(path)[1] or ".png"
            tmp = os.path.join(DL, f"{pid}_{i}{ext}")
            fetch(BASE + path, tmp)
            name = f"{pid}_cover.webp" if (i == 0 and s["header"]) else f"{pid}_{i}.webp"
            out = os.path.join(outdir, name)
            to_webp(tmp, out)
            shots.append(f"/assets/game/{pid}/{name}")

        cover = shots[0]
        entry = {
            "id": pid,
            "Description": "\n".join(s["story"]) or "\n".join(s["gameplay"]),
            "TechStack": [],
            "Screenshots": shots,
            "Img": cover,
            "Title": s["name"],
            "WebPage": s["webPage"],
            "StorePage": s["storePage"],
            "Role": [],
            "Features": s["gameplay"],
            "Order": order,
            "Contents": [],
        }
        order -= 1
        projects.append(entry)
        added.append((pid, s["name"], len(shots)))
        print(f"  {pid:22s} {len(shots)} gambar", flush=True)

    tail = "\r\n" if raw.endswith("\r\n") else ("\n" if raw.endswith("\n") else "")
    nl = "\r\n" if "\r\n" in raw else "\n"
    with io.open(PROJECTS, "w", encoding="utf-8", newline=nl) as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
        if tail:
            f.write("\n")

    print(f"\n{len(added)} game ditambahkan, total sekarang {len(projects)}")
    for pid, name, n in added:
        print(f"   {name:24s} -> {pid} ({n} gambar)")


if __name__ == "__main__":
    main()
