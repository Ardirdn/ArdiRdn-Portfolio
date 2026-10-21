// Gameplay system / mechanic showcases.
// Paths are resolved once here so every consumer gets deploy-ready URLs.
import rawSystems from '../data/systems_data.json';
import { transformAssetPaths } from '../utils/assetPath';

const data = transformAssetPaths(rawSystems);

export const systemsIntro = {
    title: data.title,
    blurb: data.blurb,
};

export const systems = data.items;

/** The ones a shortened section leads with. */
export const featuredSystems = systems.filter((item) => item.featured);

/**
 * These recordings run 27s to nearly 4 minutes. A card autoplays the short
 * preview cut; the lightbox opens the real thing.
 */
export const systemClip = (item) => ({
    ...item,
    src: item.src,
    label: item.title,
    caption: item.summary,
});

export const systemPreview = (item) => ({
    src: item.preview ?? item.src,
    poster: item.poster,
});

/** Lookup for the per-system page. */
export const findSystem = (id) => systems.find((item) => item.id === id);

export const robloxSystems = systems.filter((item) => item.engine === 'roblox');
