"""Generate src/data/systems_data.json from the transcode manifest.

Copy lives here rather than in the JSON so a re-run keeps it; edit the META
table below to reword a card.
"""
import io
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(HERE, "systems_manifest.json")
OUT = os.path.join(r"D:\Portfolio\ArdiRdn-Portfolio\Build\App", "src", "data", "systems_data.json")
BASE = "/assets/Systems"

# slug -> title, tag, featured, summary.
# Summaries describe what each recording actually shows; they are a starting
# point for the author to sharpen, not a claim about implementation detail.
META = {
    "gun-system": (
        "Gun System", "Combat", True,
        "First-person weapon handling built in Studio — equip, aim, fire and reload, "
        "with the recoil and hit feedback tuned against a live target range."),
    "vehicle-system": (
        "Vehicle System", "Vehicle", True,
        "Drivable car with a speedometer HUD, running inside a populated town map "
        "rather than an empty baseplate."),
    "catalogue-system": (
        "Catalogue System", "UI / UX", True,
        "In-game marketplace: a searchable, filterable grid of items with previews "
        "and per-item detail, driven entirely from data."),
    "dinosaur-npc": (
        "Dinosaur NPC System", "AI", True,
        "Dinosaur NPCs roaming an open map — perception, pursuit and reaction to "
        "being hit, with several species sharing one behaviour setup."),
    "dance-minigame": (
        "Synchronized Dance Minigame", "Minigame", True,
        "Rhythm minigame with arrow prompts, difficulty modes and scoring, played "
        "by two characters in sync."),
    "throwable-mechanic": (
        "Throwable Mechanic", "Physics", False,
        "Pick up, carry and throw physics objects. Recorded as a work in progress, "
        "so it shows the raw mechanic rather than a finished feel pass."),
    "smash-tape": (
        "Smash Tape Mechanic", "Mechanic", False,
        "Smash interaction from a live Roblox experience, with the collect and "
        "auto-claim loop running around it."),
    "bungee-jump-mechanic": (
        "Bungee Jump Mechanic", "Physics", False,
        "Rope-driven bungee jump: launch, stretch and rebound, shipped inside a "
        "live experience."),
}


# Second batch, captured straight from Studio. Copy is deliberately a
# placeholder — the author asked for the videos in first and the wording later.
PLACEHOLDER = "Placeholder — description to be written."

META.update({
    "advancedtradesystemwithchat": ("Advanced Trade System", "Economy", True, PLACEHOLDER),
    "heroshop":                    ("Hero Shop", "UI / UX", True, PLACEHOLDER),
    "itemshopmenu":                ("Item Shop Menu", "UI / UX", False, PLACEHOLDER),
    "shopmenu":                    ("Shop Menu", "UI / UX", False, PLACEHOLDER),
    "matchmakingsystem":           ("Matchmaking System", "Multiplayer", True, PLACEHOLDER),
    "questsystem":                 ("Quest System", "Progression", False, PLACEHOLDER),
    "seasonpass-battlepass-system": ("Season Pass / Battlepass", "Progression", False, PLACEHOLDER),
    "dailyreward":                 ("Daily Reward", "Progression", False, PLACEHOLDER),
    "playtime-reward":             ("Playtime Reward", "Progression", False, PLACEHOLDER),
    "inviterewardsystem":          ("Invite Reward System", "Progression", False, PLACEHOLDER),
    "fighting-mechanic":           ("Fighting Mechanic", "Combat", True, PLACEHOLDER),
    "fishing-mechanic":            ("Fishing Mechanic", "Mechanic", True, PLACEHOLDER),
    "rubberbreakmechanic":         ("Rubber Break Mechanic", "Physics", False, PLACEHOLDER),
})

# Each system has its own page now; the body copy there is a placeholder until
# the author writes it.
LOREM = (
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod "
    "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim "
    "veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea "
    "commodo consequat."
)


def clock(seconds):
    return f"{int(seconds) // 60}:{int(round(seconds)) % 60:02d}"


def main():
    manifest = {m["slug"]: m for m in json.load(io.open(MANIFEST, encoding="utf-8"))}
    items = []
    for slug, (title, tag, featured, summary) in META.items():
        m = manifest[slug]
        items.append({
            "id": slug,
            "title": title,
            "tag": tag,
            # Every one of these was built in Roblox Studio; the Roblox page
            # filters on this the same way it does for the VFX clips.
            "engine": "roblox",
            "featured": featured,
            "summary": summary,
            "description": LOREM,
            "duration": clock(m["duration"]),
            "src": f"{BASE}/{slug}.webm",
            "preview": f"{BASE}/{slug}-preview.webm",
            "poster": f"{BASE}/{slug}.webp",
        })

    data = {
        "title": "Systems & Mechanics",
        "blurb": ("Gameplay systems built end to end — weapons, vehicles, NPC behaviour, "
                  "economy UI and the physics mechanics around them. Each card plays a "
                  "short cut; open one for the full showcase."),
        "items": items,
    }

    with io.open(OUT, "w", encoding="utf-8", newline="\r\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"{len(items)} systems -> {OUT}")
    for i in items:
        print(f"   {i['title']:30s} {i['tag']:10s} {i['duration']:>5s}  featured={i['featured']}")


if __name__ == "__main__":
    main()
