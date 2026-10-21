# Character Skills asset pipeline

Rebuilds everything the Character Skills section serves. Run in this order,
from this folder. Requires `ffmpeg`/`ffprobe` on PATH.

| Script | What it does |
| --- | --- |
| `transcode_skills.py` | `CharacterSkills/` captures (1440p60 mp4, gitignored, ~48 GB) → `public/assets/CharacterSkills/<Char>/<key>-<variant>.webm` + `.webp` poster. Resumable: existing outputs are skipped. Writes `skills_manifest.json`. |
| `fetch_thumbs.py` | 1:1 character portraits. Licensed characters come from MyAnimeList; originals/class archetypes fall back to a gameplay frame. Writes `thumbs_report.json`. |
| `regen_generic_thumbs.py` | Re-crops only the 11 original/class portraits — their crop centre and timecode are hand-set per character. |
| `gen_data.py` | Manifest + thumb report → `src/data/characterskills_data.json`. Display names, roles, blurbs and the featured list live in its `META`/`FEATURED` tables. |

## Encode settings

VP9 webm, 720p30, CRF 33, Opus 128k — the same recipe as the rest of the
showcase media. Posters are WebP grabbed at 45% of the clip's duration (the
VFX peak usually sits mid-clip) and scaled to 1280 wide.

## Adding the other camera angles

Only `front` and `front, enemy` ship. The captures also hold `side` and `back`
in both solo and enemy flavours. To add one, extend `VARIANTS` in
`transcode_skills.py`, re-run it (already-encoded clips are skipped), then
re-run `gen_data.py`. Each extra angle adds roughly 120 MB.

## Source masters

`CharacterSkills/` at the repo root is gitignored. It is the only copy of the
captures — nothing here deletes or overwrites it.
