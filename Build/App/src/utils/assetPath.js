// Utility to handle asset paths for GitHub Pages deployment
// In dev: BASE_URL = "/"
// In prod (GitHub Pages): BASE_URL = "/ArdiRdn-Portfolio/"

const BASE = import.meta.env.BASE_URL;

/**
 * Prepend the base URL to an asset path.
 * e.g. "/assets/image.png" -> "/ArdiRdn-Portfolio/assets/image.png"
 */
export function assetPath(path) {
    if (!path || typeof path !== 'string') return path;
    // Already an external URL or data URI
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    // Already has base URL prefix — prevent double-prefixing
    if (BASE !== '/' && path.startsWith(BASE)) return path;
    // Remove leading slash to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${BASE}${cleanPath}`;
}

/**
 * Recursively transform all string values in an object/array
 * that start with "/assets/" or "/data/" to include the base URL.
 */
export function transformAssetPaths(data) {
    if (typeof data === 'string') {
        if (data.startsWith('/assets/') || data.startsWith('/data/') || data.startsWith('/Ardi_Photo')) {
            return assetPath(data);
        }
        return data;
    }
    if (Array.isArray(data)) {
        return data.map(item => transformAssetPaths(item));
    }
    if (data && typeof data === 'object') {
        const result = {};
        for (const key in data) {
            result[key] = transformAssetPaths(data[key]);
        }
        return result;
    }
    return data;
}
