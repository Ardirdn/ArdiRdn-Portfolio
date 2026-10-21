"""Scrape the Roblox titles off the studio's own project site.

Reads the project index chunk for the category tag (the list page HTML does not
carry it), then one detail page per Roblox title for copy, screenshots and the
real game link. Output is JSON only - nothing is written into the portfolio by
this script, and every downloaded file lands in the quarantine directory.
"""
import html
import io
import json
import os
import re
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "trimatra")
DL = os.path.join(OUT, "media_untrusted")
BASE = "https://www.trimatra.io"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# The studio community link sits in every page footer; it is not a game link.
COMMUNITY = "roblox.com/communities"


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    return data if binary else data.decode("utf-8", "replace")


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", " ", fragment))


def section(page, heading):
    """Body copy that follows an <h1>Heading</h1> on a detail page."""
    m = re.search(rf"<h1[^>]*>\s*{heading}\s*</h1>(.*?)(?=<h1|<h2|$)", page, re.S | re.I)
    if not m:
        return []
    chunks = re.findall(r"<p[^>]*>(.*?)</p>", m.group(1), re.S)
    out = []
    for c in chunks:
        t = re.sub(r"\s+", " ", text_of(c)).strip()
        if len(t) > 25:
            out.append(t)
    return out


def main():
    os.makedirs(DL, exist_ok=True)
    rows = json.load(io.open(os.path.join(OUT, "all_projects.json"), encoding="utf-8"))
    roblox = [r for r in rows if r["category"] == "Roblox Studio"]

    scraped = []
    for r in roblox:
        slug = r["link"].rstrip("/").split("/")[-1]
        page = get(f"{BASE}/project/{slug}/")
        time.sleep(1.0)

        links = sorted(set(re.findall(r'href="(https://(?:www\.)?roblox\.com/[^"#]*)"', page)))
        game = next((l for l in links if COMMUNITY not in l), None)

        # Two layouts in use: /games/Screenshot/<slug>/ and /portfolio/<Name>/,
        # and the portfolio one does not name its shots consistently - anything
        # that is not the banner or thumbnail is a screenshot.
        portfolio = sorted(set(
            re.findall(r'src="(/portfolio/[^"]+\.(?:png|jpg|jpeg|webp))"', page)))
        is_header = re.compile(r"(banner|thumbnail)", re.I)
        shots = sorted(set(re.findall(r'src="(/games/Screenshot/[^"]+)"', page)))
        shots += [p for p in portfolio if not is_header.search(p)]
        header = (re.findall(r'src="(/games/Header/[^"]+)"', page)
                  + [p for p in portfolio if is_header.search(p)])
        icon = re.findall(r'src="(/games/Icons/[^"]+)"', page)

        dev = section(page, "Estimated Development Time")
        entry = {
            "slug": slug,
            "name": r["name"],
            "icon": icon[0] if icon else r["icon"],
            "header": header[0] if header else None,
            "webPage": f"{BASE}/project/{slug}",
            "storePage": game,
            "story": section(page, "Story"),
            "gameplay": section(page, "Gameplay"),
            "devTime": dev,
            "screenshots": shots,
        }
        scraped.append(entry)
        print(f"  {r['name']:24s} shots={len(shots):2d}  store={'yes' if game else 'NO'}", flush=True)

    json.dump(scraped, io.open(os.path.join(OUT, "roblox_scraped.json"), "w", encoding="utf-8"),
              indent=2, ensure_ascii=False)
    print(f"\n{len(scraped)} titles -> {os.path.join(OUT, 'roblox_scraped.json')}")


if __name__ == "__main__":
    main()
