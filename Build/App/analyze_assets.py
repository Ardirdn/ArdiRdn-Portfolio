import json
import os
import re

# Configuration
PROJECT_ROOT = r"c:\Users\Studi\Downloads\PortFolio_Build - Copy (2)\Portfolio_Aldi"
ASSETS_DIR = os.path.join(PROJECT_ROOT, "public", "assets")
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
SRC_DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")
ASSETS_LIST_FILE = "assets_list.txt"
UNUSED_ASSETS_FILE = "unused_assets.txt"

# Helper to normalize paths
def normalize_path(path):
    if not path or not isinstance(path, str): 
        return None
    # Convert backslashes to forward slashes
    path = path.replace("\\", "/")
    # Remove drive letter if present (e.g., C:/...)
    if ":" in path:
        path = path.split(":", 1)[1]
    # Ensure it starts with /assets/
    if "/public/assets/" in path:
        path = "/assets/" + path.split("/public/assets/", 1)[1]
    elif "/assets/" in path:
        path = "/assets/" + path.split("/assets/", 1)[1]
    
    return path.lower() # Case insensitive comparison

# 1. Load Existing Assets
existing_assets = set()
try:
    with open(ASSETS_LIST_FILE, "r", encoding="utf-8") as f: # Try utf-8 first
        for line in f:
            if line.strip():
                p = normalize_path(line.strip())
                if p: existing_assets.add(p)
except UnicodeDecodeError:
    with open(ASSETS_LIST_FILE, "r", encoding="utf-16") as f: # Fallback to utf-16
         for line in f:
            if line.strip():
                p = normalize_path(line.strip())
                if p: existing_assets.add(p)

print(f"Found {len(existing_assets)} existing assets.")

# 2. Load Used Assets from JSONs
used_assets = set()

def add_asset(path):
    if not path: return
    normalized = normalize_path(path)
    if normalized:
        used_assets.add(normalized)

# Helper for recursive content parsing
def parse_contents(contents):
    if not contents: return
    for content in contents:
        add_asset(content.get("Img"))
        add_asset(content.get("Vid"))
        if "Texts" in content: # Texts is usually list of strings, ignore
            pass

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
except FileNotFoundError:
    print("Warning: 3d_generated.json not found")

# 2b. 3dshowcase.json
try:
    with open(os.path.join(DATA_DIR, "3dshowcase.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("thumbnail"))
            for img in item.get("images", []):
                add_asset(img)
except FileNotFoundError:
    print("Warning: 3dshowcase.json not found")

# 2c. leveldesigns.json
try:
    with open(os.path.join(DATA_DIR, "leveldesigns.json"), "r") as f:
        data = json.load(f)
        for item in data:
            folder = item.get("folder", "")
            add_asset(item.get("thumbnail"))
            # Images are filenames relative to folder
            for img in item.get("images", []):
                full_path = f"{folder}/{img}"
                add_asset(full_path)
except FileNotFoundError:
    print("Warning: leveldesigns.json not found")

# 2d. projects.json
try:
    with open(os.path.join(DATA_DIR, "projects.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("Img")) 
            # Check for both capitalized and lowercase keys just in case
            screenshots = item.get("Screenshots") or item.get("screenshots")
            if screenshots:
                for shot in screenshots:
                    add_asset(shot)
            
            # Contents parsing
            parse_contents(item.get("Contents"))
            parse_contents(item.get("contents"))

except FileNotFoundError:
    print("Warning: projects.json not found")

# 2e. tools.json
try:
    with open(os.path.join(DATA_DIR, "tools.json"), "r") as f:
        data = json.load(f)
        for item in data:
            add_asset(item.get("Img"))
            add_asset(item.get("Vid")) # Check for Vid too
            
            screenshots = item.get("Screenshots") or item.get("screenshots")
            if screenshots:
                 for shot in screenshots:
                    add_asset(shot)
            
            parse_contents(item.get("Contents"))
            parse_contents(item.get("contents"))

except FileNotFoundError:
    print("Warning: tools.json not found")

# 2f. uiux_data.json (src/data/uiux_data.json)
try:
    with open(os.path.join(SRC_DATA_DIR, "uiux_data.json"), "r") as f:
        data = json.load(f)
        for item in data:
            for img in item.get("images", []):
                add_asset(img)
except FileNotFoundError:
    print("Warning: uiux_data.json not found")
    
# 2g. 3d_assets.json (src/data/3d_assets.json)
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
except FileNotFoundError:
    print("Warning: 3d_assets.json not found")


print(f"Found {len(used_assets)} used assets from JSONs.")

# 3. Hardcoded references in Code
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


print(f"Total used assets references: {len(used_assets)}")

# 4. Determine Unused Assets
unused = []
for asset in existing_assets:
    # We normalized to /assets/... and lowercase.
    # But check if asset starts with /assets/
    # Some files in existing_assets might be meta files or random stuff in folders not scanned properly?
    # assets_list.txt comes from public/assets recursion. So they are definitely assets.
    
    if asset not in used_assets:
        unused.append(asset)

# Write to file
with open(UNUSED_ASSETS_FILE, "w", encoding="utf-8") as f:
    for item in sorted(unused):
        f.write(item + "\n")

print(f"Identified {len(unused)} unused assets. List written to {UNUSED_ASSETS_FILE}")
