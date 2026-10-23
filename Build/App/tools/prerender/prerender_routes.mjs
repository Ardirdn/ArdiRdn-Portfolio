/**
 * Give every client-side route a real file on disk.
 *
 * GitHub Pages has no server-side rewriting, so a SPA normally relies on
 * 404.html: the path is unknown, Pages serves 404.html, the app boots and
 * routes itself. That renders correctly for a visitor, but the response is
 * still HTTP 404 — so Discord, X and Slack refuse to unfurl the link, and
 * search engines will not index it. Both matter when a link is pasted into
 * a client pitch.
 *
 * Writing dist/<route>/index.html for each route makes Pages answer 200 with
 * no change to the app. 404.html stays as the fallback for anything missed.
 *
 * Each page also gets its own title/description/image, so a pasted link
 * previews as that page rather than as the site's front door.
 */
import fs from "node:fs";
import path from "node:path";

const APP = path.resolve(import.meta.dirname, "..", "..");
const DIST = path.join(APP, "dist");
const ORIGIN = "https://ardigamedev.com";

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const data = (...p) => path.join(APP, ...p);

/** Absolute URL for an unfurler; relative paths are not reliably resolved. */
const absolute = (src) =>
    !src ? `${ORIGIN}/Meta.png`
        : src.startsWith("http") ? src
            : `${ORIGIN}${src.startsWith("/") ? "" : "/"}${encodeURI(src)}`;

const routes = [];
const add = (route, title, description, image) =>
    routes.push({ route, title, description, image });

// --- static pages -----------------------------------------------------------
add("/roblox", "Roblox Development — Ardi Rudini",
    "Everything built on Roblox: shipped experiences, a full combat roster, environment art and the reward flows around them.",
    "/assets/game/MountNirwana/mt_nirwana_1.webp");
add("/roblox/games", "Roblox Experiences — Ardi Rudini",
    "Every title shipped on Roblox, with the role, systems and art behind each one.",
    "/assets/game/MountNirwana/mt_nirwana_1.webp");
add("/systems", "Systems & Mechanics — Ardi Rudini",
    "Gameplay systems built end to end: weapons, vehicles, NPC behaviour, economy UI and the physics mechanics around them.",
    "/assets/Systems/gun-system.webp");
add("/character-skills", "Character Skills — Ardi Rudini",
    "A battlegrounds roster captured in Studio: basic combo, four skills and an ultimate per character.",
    "/assets/CharacterSkills/Gojo/skill3-enemy.webp");
add("/level-designs", "Level Design — Ardi Rudini",
    "Environments built in Unreal, Unity and Roblox Studio.",
    "/assets/leveldesign/roblox/Cinematic Mountain/RobloxMapPortfolio15.webp");
add("/ui-ux", "UI / UX — Ardi Rudini",
    "Interface and experience design for games and applications.");
add("/modular-character", "Modular Character System — Ardi Rudini",
    "A modular character pipeline, from mesh assembly to material variation.");

// --- data-driven detail pages ----------------------------------------------
for (const s of readJson(data("src", "data", "systems_data.json")).items) {
    add(`/systems/${s.id}`, `${s.title} — Ardi Rudini`, s.summary, s.poster);
}

for (const c of readJson(data("src", "data", "characterskills_data.json")).characters) {
    add(`/character-skills/${c.id}`,
        `${c.name} — Character Skills — Ardi Rudini`,
        `${c.skills.length} abilities, recorded solo and against a target.`,
        c.thumbnail);
}

for (const p of readJson(data("public", "data", "projects.json"))) {
    add(`/games/${p.id}`, `${p.Title} — Ardi Rudini`,
        (p.Description || "").replace(/\s+/g, " ").slice(0, 180), p.Img);
}

for (const t of readJson(data("public", "data", "tools.json"))) {
    add(`/tools/${t.id}`, `${t.Title} — Ardi Rudini`,
        (t.Description || "").replace(/\s+/g, " ").slice(0, 180), t.Img);
}

for (const l of readJson(data("public", "data", "leveldesigns.json"))) {
    add(`/level-designs/${l.id}`, `${l.title} — Level Design — Ardi Rudini`,
        l.description, l.thumbnail);
}

for (const u of readJson(data("src", "data", "uiux_data.json"))) {
    add(`/ui-ux/${u.id}`, `${u.title} — UI / UX — Ardi Rudini`,
        u.description, u.images?.[0]);
}

// 3D assets nest three deep; category and pack are the levels worth sharing.
for (const cat of readJson(data("src", "data", "3d_assets.json")).categories) {
    add(`/3d-assets/${cat.id}`, `${cat.name} — 3D Assets — Ardi Rudini`,
        cat.description, cat.packs?.[0]?.cover);
    for (const pack of cat.packs ?? []) {
        add(`/3d-assets/${cat.id}/${pack.id}`, `${pack.name} — 3D Assets — Ardi Rudini`,
            `${pack.items?.length ?? 0} models in this pack.`, pack.cover);
    }
}

// --- emit -------------------------------------------------------------------
const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const escape = (s) =>
    String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;")
        .replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Rewrite the shell's own tags rather than appending duplicates. */
function page({ route, title, description, image }) {
    const url = `${ORIGIN}${route}`;
    const blurb = escape((description || "").replace(/\s+/g, " ").trim());
    return shell
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[\s\S]*?(")/, `$1${blurb}$2`)
        .replace(/(<meta\s+property="og:title"\s*\n?\s*content=")[\s\S]*?(")/,
            `$1${escape(title)}$2`)
        .replace(/(<meta\s+property="og:description"\s*\n?\s*content=")[\s\S]*?(")/,
            `$1${blurb}$2`)
        .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/,
            `$1${absolute(image)}$2`)
        .replace(/(<meta\s+property="twitter:url"\s+content=")[^"]*(")/, `$1${url}$2`);
}

let written = 0;
for (const entry of routes) {
    const dir = path.join(DIST, entry.route.replace(/^\//, ""));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.html"), page(entry), "utf8");
    written += 1;
}

console.log(`prerendered ${written} routes`);
