"""Generate src/data/characterskills_data.json from the transcode manifest."""
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = r"D:\Portfolio\ArdiRdn-Portfolio"
MANIFEST = os.path.join(HERE, "skills_manifest.json")
THUMBS = os.path.join(HERE, "thumbs_report.json")
OUT = os.path.join(ROOT, "Build", "App", "src", "data", "characterskills_data.json")
BASE = "/assets/CharacterSkills"

# folder -> display name, series it is modelled on, combat role, blurb
META = {
    "Aizen":        ("Sosuke Aizen",  "Bleach",           "Technical", "Illusion kit built around misdirection: the clone reveal lands before the real hit does."),
    "Android18":    ("Android 18",    "Dragon Ball",      "Ranger",    "Energy volleys and blade throws, tuned for sustained chip damage at range."),
    "BakiHanma":    ("Baki Hanma",    "Baki",             "Bruiser",   "Pure hand-to-hand chain — spin kick into double hit into a committed smash."),
    "Balanced1":    ("Balanced I",    "Class Archetype",  "Balanced",  "Starter archetype used to tune baseline damage and cooldown pacing."),
    "Balanced2":    ("Balanced II",   "Class Archetype",  "Balanced",  "Second balanced preset: a slower wind-up traded for a wider blast."),
    "Ejin":         ("Ejin",          "Original",         "Bruiser",   "Original design: a drill-rush opener that converts into a ground-burst finisher."),
    "Frieza":       ("Frieza",        "Dragon Ball",      "Ranger",    "Precision beams and saucers, every skill built to punish from a distance."),
    "Gilgamesh":    ("Gilgamesh",     "Fate",             "Burst",     "Projectile-heavy kit — the ultimate opens a full sword rain over the arena."),
    "Gojo":         ("Satoru Gojo",   "Jujutsu Kaisen",   "Burst",     "Red, Blue and the hollow purple finisher, each with its own charge language."),
    "Goku":         ("Son Goku",      "Dragon Ball",      "Balanced",  "Classic rush-down: flash step into impact, then a full energy burst."),
    "GonFreecss":   ("Gon Freecss",   "Hunter x Hunter",  "Bruiser",   "Aura orbs that launch, smash and finally rip the ground up."),
    "Healer":       ("Healer",        "Class Archetype",  "Support",   "Support preset — the healing wave drove the buff/aura VFX language."),
    "Ichigo":       ("Ichigo Kurosaki", "Bleach",         "Bruiser",   "Crescent slashes and Getsuga arcs, all reading off one blade trail system."),
    "Kaguya":       ("Kaguya Otsutsuki", "Naruto",        "Technical", "Portal-based kit: strikes arrive from somewhere other than where she stands."),
    "Luffy":        ("Monkey D. Luffy", "One Piece",      "Bruiser",   "Stretch attacks with a Gear Second state that re-times the whole kit."),
    "Madara":       ("Madara Uchiha", "Naruto",           "Technical", "Fire annihilation and clones, with a Sharingan opener that sets up the rest."),
    "Naruto":       ("Naruto Uzumaki", "Naruto",          "Balanced",  "Shadow-clone kit — every skill spawns, strikes with, and despawns clones."),
    "Natsu":        ("Natsu Dragneel", "Fairy Tail",      "Burst",     "Fire dragon kit, from flame kick to a full-cone dragon roar."),
    "Ranger1":      ("Ranger I",      "Class Archetype",  "Ranger",    "Ranged preset: fireball barrage used to tune projectile spacing."),
    "Ranger2":      ("Ranger II",     "Class Archetype",  "Ranger",    "Sustained-beam variant of the ranger archetype."),
    "Ranger3":      ("Ranger III",    "Class Archetype",  "Ranger",    "Burst variant — triple shot with a tighter spread."),
    "Saitama":      ("Saitama",       "One Punch Man",    "Bruiser",   "The joke is the design: ordinary punches that escalate to a serious smash."),
    "Sasuke":       ("Sasuke Uchiha", "Naruto",           "Technical", "Fire and lightning in one kit — Chidori current closes the gap."),
    "Sukuna":       ("Ryomen Sukuna", "Jujutsu Kaisen",   "Burst",     "Heaviest kit in the set; the ultimate is the longest sequence recorded."),
    "Tanjiro":      ("Tanjiro Kamado", "Demon Slayer",    "Balanced",  "Breathing forms — water surface and whirlpool share one flowing trail shader."),
    "TankSoldier1": ("Tank Soldier I", "Class Archetype", "Tank",      "Tank preset: ground slam used to tune knockback and screen shake."),
    "TankSoldier2": ("Tank Soldier II", "Class Archetype", "Tank",     "Heavy single-target punch variant of the tank archetype."),
    "TankSoldier3": ("Tank Soldier III", "Class Archetype", "Tank",    "Area-denial variant — earth breaker with a wide impact ring."),
    "TankSoldier4": ("Tank Soldier IV", "Class Archetype", "Tank",     "Mobility tank: phantom dash closes distance before the slam."),
    "Vegeta":       ("Vegeta",        "Dragon Ball",      "Burst",     "Barrage into Final Flash — the kit builds to one committed beam."),
    "Yoriichi":     ("Yoriichi Tsugikuni", "Demon Slayer", "Technical", "Sun breathing: blazing rush and storm field layered over one trail system."),
    "YoujiItadori": ("Yuji Itadori",  "Jujutsu Kaisen",   "Bruiser",   "Charged fists leading into Black Flash, the kit's one high-impact beat."),
    "Emilia":       ("Emilia",         "Re:Zero",          "Technical", "Ice control kit: rings and slides that shape the ground before the slam lands."),
    "Beatrice":     ("Beatrice",       "Re:Zero",          "Burst",     "Spatial kit built on wormholes, with spikes arriving from wherever she opens one."),
    "BillCIpher":   ("Bill Cipher",    "Gravity Falls",    "Burst",     "Reality-warping set: a checkerboard slam, soot fire and a golden fist finisher."),
    "SteroidMan":   ("Steroid Man",    "Original",         "Bruiser",   "Two heavy commitments - the ground rapture opens the arena, venom rush fills it."),
    "BeamStrike":   ("Beam Strike",    "Original",         "Ranger",    "Elemental ranged kit: wind spike, thunder strike and a tornado that judges the field."),
}

# The later characters' clips are "<Char>_<Skill>.mp4" with no index, and the
# manifest comes back alphabetical, so their running order is set here.
FLAT_ORDER = {
    "BeamStrike": ["windspike", "thunderstrike", "tornadojudge"],
    "Beatrice":   ["spike", "wormhole", "ultimate"],
    "BillCIpher": ["firesoot", "checkerslam", "goldenfist"],
    "Emilia":     ["icesoldier", "iceslide", "icering", "iceslam"],
    "SteroidMan": ["groundrapture", "venomrush"],
}

# Skill names the camelCase split cannot recover.
NAME_FIX = {"Venomrush": "Venom Rush"}

# Shown in the landing-page showcase, mapped to the skill its card leads with.
# Several ultimates run 10-18s and weigh 3-9 MB each, and six of those
# autoplaying at once is the slowest thing on the landing page, so a featured
# card leads with a shorter signature move instead. The ultimate is still on
# the character page, uncut.
FEATURED = {
    "Gojo":       ["skill3"],                      # Red
    "Sukuna":     ["skill3"],                      # Meteor Blast
    "Naruto":     ["skill5"],                      # Shadow Clones
    "Tanjiro":    ["skill1"],                      # Hinokami
    # First entry is what the card autoplays; the rest sit behind its chips.
    "Emilia":     ["icering", "iceslam"],
    "SteroidMan": ["venomrush", "groundrapture"],
}

SKILL_LABEL = {"m1s": "Basic", "skill1": "Skill 1", "skill2": "Skill 2",
               "skill3": "Skill 3", "skill4": "Skill 4", "skill5": "Ultimate"}


def slot_label(folder, key, raw, position):
    """Original characters carry m1s/skill1..5; later ones are numbered here."""
    if folder not in FLAT_ORDER:
        return SKILL_LABEL.get(key, key)
    if raw.lower() == "ultimate":
        return "Ultimate"
    return f"Skill {FLAT_ORDER[folder].index(key) + 1}" if key in FLAT_ORDER[folder] else "Skill"


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def pretty(raw):
    """CloneStrike -> Clone Strike, Ult -> Ultimate, m1s -> Basic Combo."""
    if raw == "m1s":
        return "Basic Combo"
    if raw == "Ult":
        return "Ultimate"
    if raw in NAME_FIX:
        return NAME_FIX[raw]
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])", " ", raw)


def clock(seconds):
    return f"{int(seconds) // 60}:{int(round(seconds)) % 60:02d}"


def main():
    manifest = json.load(open(MANIFEST, encoding="utf-8"))
    thumbs = {t["character"]: t for t in json.load(open(THUMBS, encoding="utf-8"))}

    by_char = {}
    for entry in manifest:
        by_char.setdefault(entry["character"], []).append(entry)

    characters = []
    for folder in sorted(by_char, key=lambda f: (folder_rank(f), f)):
        name, series, role, blurb = META[folder]
        skills = []
        for entry in sorted(by_char[folder], key=lambda e: order(folder, e["key"])):
            variants = {}
            for variant, v in sorted(entry["variants"].items()):
                stem = f"{BASE}/{folder}/{entry['key']}-{variant}"
                variants[variant] = {"src": f"{stem}.webm", "poster": f"{stem}.webp"}
            # The duration shown is the real clip's, never the trimmed preview's.
            longest = max(v["duration"] for k, v in entry["variants"].items()
                          if k != "preview")
            skills.append({
                "key": entry["key"],
                "name": pretty(entry["rawName"]),
                "slot": slot_label(folder, entry["key"], entry["rawName"], len(skills)),
                "duration": clock(longest),
                "variants": variants,
            })

        characters.append({
            "id": slug(name),
            "name": name,
            "folder": folder,
            "series": series,
            "role": role,
            "summary": blurb,
            "featured": folder in FEATURED,
            "previewSkills": FEATURED.get(folder, []),
            "thumbnail": f"{BASE}/{folder}/thumb.webp",
            "thumbnailOrigin": thumbs.get(folder, {}).get("origin", "unknown"),
            "skills": skills,
        })

    data = {
        "title": "Character Skills",
        "blurb": ("Every ability in the battlegrounds project, recorded per character: "
                  "basic combo, four skills and an ultimate. Each clip is shown solo so "
                  "the effect reads clearly, and again against a target so the impact, "
                  "hit-stop and knockback land in context."),
        "characters": characters,
    }

    with open(OUT, "w", encoding="utf-8", newline="\r\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"{len(characters)} characters, {sum(len(c['skills']) for c in characters)} skills")
    print(f"featured: {[c['name'] for c in characters if c['featured']]}")
    print("->", OUT)


def order(folder, key):
    flat = FLAT_ORDER.get(folder)
    if flat:
        return flat.index(key) if key in flat else len(flat)
    return 0 if key == "m1s" else int(key.replace("skill", ""))


def folder_rank(folder):
    """Named characters first, class archetypes after."""
    return 1 if META[folder][1] == "Class Archetype" else 0


if __name__ == "__main__":
    main()
