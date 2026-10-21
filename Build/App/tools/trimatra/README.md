# Importing Roblox titles from trimatra.io

The studio site is the source of record for the games; this pulls the Roblox
ones into `public/data/projects.json`. Run from this folder, in order.

1. **Get the category list.** The project index page's HTML does *not* carry the
   engine tag — the filter runs client side off a Next.js chunk. Grab the page,
   find the `app/project/page-*.js` chunk it loads, and extract the
   `{id,link,icongame,namegame,category}` records into `all_projects.json`.
   `category: "Roblox Studio"` is the filter.
2. **`scrape_trimatra.py`** — one detail page per Roblox title: story, gameplay,
   screenshots, and the real game link. The studio community link appears in
   every footer and is skipped. Two page layouts exist (`/games/Screenshot/<slug>/`
   and `/portfolio/<Name>/`, the latter with inconsistent filenames), both handled.
   Writes `roblox_scraped.json`.
3. **`import_roblox_games.py`** — downloads the art into a quarantine folder,
   converts it to WebP at 1280 wide, and appends entries to `projects.json`.
   Titles already present are skipped, so re-running is safe.

## What the site does not provide

`Role`, `TechStack`, `Downloads` and `MonthDeveloped` are not on trimatra.io.
They are written empty rather than guessed — `ProjectDetail.jsx` already renders
a placeholder for each. Fill them in by hand.

`Quarantine A Brainrot` has Story and Gameplay headings on the site with no copy
under them, so its `Description` is empty at the source.

## How a title reaches the Roblox page

`src/services/roblox.js` treats any project whose `StorePage` contains
`roblox.com` as Roblox work. Nothing else needs changing.
