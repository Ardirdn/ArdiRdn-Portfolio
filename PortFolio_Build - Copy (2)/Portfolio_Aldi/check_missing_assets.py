import json
import os

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
ASSETS_LIST_FILE = "assets_list.txt"
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
SRC_DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")

# Helper to normalize paths
def normalize_path(path):
    if not path or not isinstance(path, str): return None
    path = path.replace("\\", "/")
    if ":" in path: path = path.split(":", 1)[1]
    if "/public/assets/" in path: path = "/assets/" + path.split("/public/assets/", 1)[1]
    elif "/assets/" in path: path = "/assets/" + path.split("/assets/", 1)[1]
    return path.lower()

# 1. Load Existing Assets
existing_assets = set()
try:
    with open(ASSETS_LIST_FILE, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                p = normalize_path(line.strip())
                if p: existing_assets.add(p)
except:
    print("Error reading assets_list.txt")

# 2. Load Used Assets
used_assets = set()

def add_asset(path):
    if not path: return
    normalized = normalize_path(path)
    if normalized: used_assets.add(normalized)

def parse_contents(contents):
    if not contents: return
    for content in contents:
        add_asset(content.get("Img"))
        add_asset(content.get("Vid"))

# (Reuse loading logic from analyze_assets.py - shortened for brevity)
# 2a. 3d_generated.json
try:
    with open(os.path.join(DATA_DIR, "3d_generated.json"), "r") as f:
        data = json.load(f)
        for category in data.get("categories", []):
            add_asset(category.get("featuredVideo"))
            for pack in category.get("packs", []):
                add_asset(pack.get("cover"))
                for item in pack.get("items", []):
                    add_asset(item.get("cover"))
                    for img in item.get("images", []):
                        add_asset(img)
                    if "webms" in item:
                        for webm in item["webms"].values():
                            add_asset(webm)
except: pass

# 2b. 3dshowcase.json
try:
    with open(os.path.join(DATA_DIR, "3dshowcase.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("thumbnail"))
            for img in item.get("images", []):
                add_asset(img)
except: pass

# 2c. leveldesigns.json
try:
    with open(os.path.join(DATA_DIR, "leveldesigns.json"), "r") as f:
        data = json.load(f)
        for item in data:
            folder = item.get("folder", "")
            add_asset(item.get("thumbnail"))
            for img in item.get("images", []):
                full_path = f"{folder}/{img}"
                add_asset(full_path)
except: pass

# 2d. projects.json
try:
    with open(os.path.join(DATA_DIR, "projects.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("Img"))
            screenshots = item.get("Screenshots") or item.get("screenshots")
            if screenshots:
                for shot in screenshots:
                    add_asset(shot)
            parse_contents(item.get("Contents"))
            parse_contents(item.get("contents"))
except: pass

# 2e. tools.json
try:
    with open(os.path.join(DATA_DIR, "tools.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("Img"))
            add_asset(item.get("Vid"))
            screenshots = item.get("Screenshots") or item.get("screenshots")
            if screenshots:
                 for shot in screenshots:
                    add_asset(shot)
            parse_contents(item.get("Contents"))
            parse_contents(item.get("contents"))
except: pass

# 2f. uiux_data.json
try:
    with open(os.path.join(SRC_DATA_DIR, "uiux_data.json"), "r") as f:
        data = json.load(f)
        for item in data:
            for img in item.get("images", []):
                add_asset(img)
except: pass

# 2g. 3d_assets.json
try:
    with open(os.path.join(SRC_DATA_DIR, "3d_assets.json"), "r") as f:
         data = json.load(f)
         if isinstance(data, dict) and "categories" in data:
             for category in data.get("categories", []):
                add_asset(category.get("featuredVideo"))
                for pack in category.get("packs", []):
                    add_asset(pack.get("cover"))
                    for item in pack.get("items", []):
                        add_asset(item.get("cover"))
                        for img in item.get("images", []):
                            add_asset(img)
                        if "webms" in item:
                            for webm in item["webms"].values():
                                add_asset(webm)
except: pass

# Hardcoded
unreal_images = [
  "Swamp_sequence.0122.png",
  "Swamp_sequence.0008.png",
  "Swamp_sequence.0009.png",
  "Swamp_sequence.0081.png",
  "Swamp_sequence.0097.png",
  "Swamp_sequence.0107.png",
  "Swamp_sequence.0129.png",
  "Swamp_sequence.0191.png",
  "Swamp_sequence.0193.png",
  "Swamp_sequence.0203.png",
  "Swamp_sequence.0232.png",
  "Swamp_sequence.0238.png",
]
for img in unreal_images:
    add_asset(f"/assets/leveldesign/unreal/South East Asian River Village/{img}")

uiux_target_images = [
    "/assets/Ui Ux/JuraganNasiPadang/Asset 37.png",
    "/assets/Ui Ux/DetainedSouls/MainMenu1.png",
    "/assets/Ui Ux/JuraganEmpang/Banner.png",
    "/assets/Ui Ux/TheDeathPath/Asset 4.png",
    "/assets/Ui Ux/JuraganFauna/JuraganFaunaBanner.png",
    "/assets/Ui Ux/LegendaryFIshHunter/Asset 25.png",
    "/assets/Ui Ux/DropStackBall/Asset 1.png"
]
for img in uiux_target_images:
    add_asset(img)

# Check for missing
missing = []
for asset in used_assets:
    # Some used assets might be external URLs (http...) -> we should ignore them
    if asset.startswith("http"): continue
    
    # We only care about /assets/ paths
    if not asset.startswith("/assets/"): continue

    if asset not in existing_assets:
        missing.append(asset)

print(f"Total used assets: {len(used_assets)}")
print(f"Missing assets (used but not found): {len(missing)}")
if missing:
    print("Found missing assets:")
    for m in sorted(missing)[:20]:
        print(m)
