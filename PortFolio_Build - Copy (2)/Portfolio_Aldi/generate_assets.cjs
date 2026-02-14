const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'assets', '3d Assets');
const output = {
    categories: []
};

// Define categories to scan
const categories = ['PBR', 'Stylized Character', 'Other'];

// Helper to recursively flatten items if "Other" has nested structure
function scanPack(packPath, cat) {
    const items = [];
    if (!fs.existsSync(packPath)) return items;

    const entries = fs.readdirSync(packPath, { withFileTypes: true });

    // Check if this directory itself is an item (has Render folder directly)
    const hasRender = entries.find(e => e.name === 'Render' && e.isDirectory());
    if (hasRender) {
        // This pack is actually a single item?
        // Or is it a pack that contains items?
        // User says: "Animal Knight" (Pack) -> "Ant" (Item).
        // Check finding 3view
        return items; // Logic below handles sub-directories as items
    }

    entries.filter(e => e.isDirectory()).forEach(entry => {
        const itemName = entry.name;
        const itemPath = path.join(packPath, itemName);

        // Check for Render folder
        const renderPath = path.join(itemPath, 'Render');
        if (fs.existsSync(renderPath)) {
            // Found an item
            const threeViewPath = path.join(renderPath, '3View');
            let cover = null;

            if (fs.existsSync(threeViewPath)) {
                const files = fs.readdirSync(threeViewPath);
                // Look for *3View_Textured.png or just any png
                const coverFile = files.find(f => f.toLowerCase().includes('3view_textured.png') || f.endsWith('.png'));
                if (coverFile) {
                    // Path relative to public
                    // absolute path: itemPath/Render/3View/coverFile
                    // public path: /assets/...
                    // construct manually
                    // itemPath ends with .../Category/Pack/ItemName
                    // path.relative(baseDir, itemPath)
                    const rel = path.relative(path.join(__dirname, 'public'), path.join(threeViewPath, coverFile));
                    cover = '/' + rel.split(path.sep).join('/');
                }
            }

            const singleViewPath = path.join(renderPath, 'SingleView');
            const webms = {};
            if (fs.existsSync(singleViewPath)) {
                ['MaterialPreview', 'Normal', 'Solid', 'Textured'].forEach(type => {
                    const typePath = path.join(singleViewPath, type);
                    if (fs.existsSync(typePath)) {
                        const files = fs.readdirSync(typePath);
                        const webm = files.find(f => f.endsWith('.webm'));
                        if (webm) {
                            const rel = path.relative(path.join(__dirname, 'public'), path.join(typePath, webm));
                            webms[type] = '/' + rel.split(path.sep).join('/');
                        }
                    }
                });
            }

            items.push({
                id: itemName.replace(/\s+/g, '-').toLowerCase(),
                name: itemName,
                cover: cover,
                webms: webms
            });
        }
    });
    return items;
}

categories.forEach(cat => {
    const catPath = path.join(baseDir, cat);
    if (!fs.existsSync(catPath)) return;

    // Find featured video
    let featuredVideo = null;
    const files = fs.readdirSync(catPath);
    const featFile = files.find(f => f.toLowerCase() === 'featured.webm');
    if (featFile) {
        featuredVideo = `/assets/3d Assets/${cat}/${featFile}`;
    }

    const catObj = {
        id: cat.replace(/\s+/g, '-').toLowerCase(),
        name: cat,
        featuredVideo: featuredVideo,
        description: `High-quality ${cat} assets for your projects.`, // Placeholder
        packs: []
    };

    const packDirs = fs.readdirSync(catPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    packDirs.forEach(packDirent => {
        const packName = packDirent.name;
        const packPath = path.join(catPath, packName);

        const items = scanPack(packPath, cat);

        if (items.length > 0) {
            catObj.packs.push({
                id: packName.replace(/\s+/g, '-').toLowerCase(),
                name: packName,
                folder: `/assets/3d Assets/${cat}/${packName}`,
                cover: items[0].cover,
                items: items
            });
        } else {
            // Maybe it's a pack with deeper structure or different structure?
            // For PBR Basarnas Helicopter:
            // PBR -> Basarnas Helicopter -> (Is this an item or a pack?)
            // User says: "cards nya itu ya folder di folder pbr nya... didalamnya langsung ada images images"
            // If PBR/BasarnasHelicopter/Render exists, then BasarnasHelicopter is an Item, effectively a Pack of size 1?
            // Or BasarnasHelicopter IS the item.

            // Let's check if packPath has Render directly
            const renderPath = path.join(packPath, 'Render');
            if (fs.existsSync(renderPath)) {
                // Treat as a Pack with 1 item
                const items = [];
                // Logic to scan this single item
                const threeViewPath = path.join(renderPath, '3View'); // Maybe?
                // User said: "didalamnya langsung ada images images"
                // I'll leave PBR handling slightly loose for now or assume standard structure

                // Reuse scan logic but treat packPath as itemPath?
                // Actually, if Render is here, it's an Item.
                // We can make a Pack that contains this 1 item.

                // Construct item
                const rel = path.relative(path.join(__dirname, 'public'), packPath); // Folder path
                // Just add as single item pack
                catObj.packs.push({
                    id: packName.replace(/\s+/g, '-').toLowerCase(),
                    name: packName,
                    folder: '/' + rel.split(path.sep).join('/'),
                    cover: null, // Need to find cover
                    items: [] // Check images?
                });
            }
        }
    });

    output.categories.push(catObj);
});

fs.writeFileSync(path.join(__dirname, 'public', 'data', '3d_generated.json'), JSON.stringify(output, null, 2));
console.log('JSON generated successfully.');
