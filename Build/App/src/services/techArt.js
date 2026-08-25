// Cutscene / shader / VFX & UI showcase data.
// Paths are resolved once here so every consumer gets deploy-ready URLs.
import rawTechArt from '../data/techart_data.json';
import { transformAssetPaths } from '../utils/assetPath';

const data = transformAssetPaths(rawTechArt);

export const cutsceneCollections = data.cutscenes;
export const shaderCollections = data.shaders;
export const vfxUiClips = data.vfxUi;

/**
 * Flatten collections into one card per video, tagged with its parent title,
 * for the gallery grids.
 */
export const flattenCollections = (collections) =>
    collections.flatMap((collection) =>
        collection.videos.map((video) => ({
            ...video,
            tag: collection.title,
        }))
    );

/** Videos a collection wants surfaced in its showcase section. */
export const featuredVideos = (collection) =>
    collection.videos.filter((video) => video.featured);
