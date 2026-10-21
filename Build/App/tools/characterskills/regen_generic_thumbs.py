"""Re-crop the 11 original/class characters' thumbnails.

They have no licensed portrait, so the thumbnail comes from the user's own
Roblox Studio capture. The actor stands in a different spot in every clip and
the capture includes the Studio chrome, so each crop centre is set by hand.
"""
import os, subprocess
ROOT = r"D:\Portfolio\ArdiRdn-Portfolio"
SRC = os.path.join(ROOT, "CharacterSkills")
OUT = os.path.join(ROOT, "Build", "App", "public", "assets", "CharacterSkills")

# character -> (clip key, seek seconds, centre x, centre y, square size)
# centres/times read off a gridded probe frame per character; the actor does
# not stand in the same spot twice and some clips only look good mid-VFX.
CROPS = {
    "Balanced1":    ("m1s",    1.6, 0.550, 0.62, 0.44),
    "Balanced2":    ("skill1", 1.0, 0.475, 0.62, 0.46),
    "Ejin":         ("skill1", 1.0, 0.470, 0.58, 0.50),
    "Healer":       ("skill1", 1.0, 0.470, 0.60, 0.46),
    "Ranger1":      ("skill1", 1.6, 0.520, 0.62, 0.44),
    "Ranger2":      ("skill1", 1.0, 0.475, 0.62, 0.50),
    "Ranger3":      ("skill1", 1.0, 0.500, 0.63, 0.46),
    "TankSoldier1": ("skill1", 1.0, 0.525, 0.63, 0.46),
    "TankSoldier2": ("skill1", 1.6, 0.520, 0.62, 0.44),
    "TankSoldier3": ("skill1", 1.0, 0.470, 0.70, 0.50),
    "TankSoldier4": ("skill1", 1.0, 0.480, 0.68, 0.46),
}

for char, (key, seek, cx, cy, size) in CROPS.items():
    cdir = os.path.join(SRC, char)
    clip = next(os.path.join(cdir, f) for f in sorted(os.listdir(cdir))
                if key in f and f.endswith("(front).mp4"))
    s = f"{size}*ih"
    x = f"clip(iw*{cx}-({s})/2,0,iw-({s}))"
    y = f"clip(ih*{cy}-({s})/2,0,ih-({s}))"
    vf = f"crop=w='{s}':h='{s}':x='{x}':y='{y}',scale=512:512:flags=lanczos"
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-ss", str(seek),
                    "-i", clip, "-frames:v", "1", "-vf", vf, "-q:v", "82",
                    os.path.join(OUT, char, "thumb.webp")],
                   check=True, stdin=subprocess.DEVNULL)
    print(" ", char)

# Characters added later use the flat "<Char>_<Skill>.mp4" naming and have no
# licensed portrait reachable from here, so their thumbnail is a hand-picked
# frame: (filename, seek, centre x, centre y, square size).
FLAT_CROPS = {
    "SteroidMan": ("SteroidMan_Venomrush.mp4",       44, 0.46, 0.58, 0.52),
    "BeamStrike": ("BeamStrike_WindSpike.mp4",       12, 0.50, 0.68, 0.38),
}

for char, (fn, seek, cx, cy, size) in FLAT_CROPS.items():
    clip = os.path.join(SRC, char, fn)
    s = f"{size}*ih"
    x = f"clip(iw*{cx}-({s})/2,0,iw-({s}))"
    y = f"clip(ih*{cy}-({s})/2,0,ih-({s}))"
    vf = f"crop=w='{s}':h='{s}':x='{x}':y='{y}',scale=512:512:flags=lanczos"
    subprocess.run(["ffmpeg", "-nostdin", "-y", "-v", "error", "-ss", str(seek),
                    "-i", clip, "-frames:v", "1", "-vf", vf, "-q:v", "82",
                    os.path.join(OUT, char, "thumb.webp")],
                   check=True, stdin=subprocess.DEVNULL)
    print(" ", char)
print("done")
