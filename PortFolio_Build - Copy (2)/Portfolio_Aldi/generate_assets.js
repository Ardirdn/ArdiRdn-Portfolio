const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'assets', '3d Assets');
const output = {
    categories: []
};

const categories = ['PBR', 'Stylized Character', 'Other'];

categories.forEach(cat => {
    const catPath = path.join(baseDir, cat);
    if (!fs.existsSync(catPath)) return;

    const catObj = {
        id: cat.replace(/\s+/g, '-').toLowerCase(),
        name: cat,
        featuredVideo: fs.existsSync(path.join(catPath, 'Featured.webm'))
            ? `/assets/3d Assets/${cat}/Featured.webm`
            : null,
        description: `Collection of ${cat} assets.`, // Placeholder
        packs: []
    };

    const packDirs = fs.readdirSync(catPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    packDirs.forEach(packDirent => {
        const packName = packDirent.name;
        const packPath = path.join(catPath, packName);

        // Check if this is a pack (has items) or an item itself (PBR might be direct?)
        // The user said: "Cards nya itu ya folder di folder pbr nya... Basarnas Helicopter"
        // So Basarnas Helicopter is a Pack.

        const packObj = {
            id: packName.replace(/\s+/g, '-').toLowerCase(),
            name: packName,
            folder: `/assets/3d Assets/${cat}/${packName}`,
            items: []
        };

        const itemDirs = fs.readdirSync(packPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory());

        itemDirs.forEach(itemDirent => {
            const itemName = itemDirent.name;
            const itemPath = path.join(packPath, itemName);

            // Check for Render/3View cover
            const renderPath = path.join(itemPath, 'Render');
            const threeViewPath = path.join(renderPath, '3View');
            let cover = null;

            if (fs.existsSync(threeViewPath)) {
                const files = fs.readdirSync(threeViewPath);
                const coverFile = files.find(f => f.endsWith('_Textured.png') || f.endsWith('.png'));
                if (coverFile) {
                    cover = `/assets/3d Assets/${cat}/${packName}/${itemName}/Render/3View/${coverFile}`;
                }
            }

            // If no 3View, maybe it's directly in Render?
            if (!cover && fs.existsSync(renderPath)) {
                const files = fs.readdirSync(renderPath);
                const coverFile = files.find(f => f.endsWith('.png'));
                if (coverFile) {
                    cover = `/assets/3d Assets/${cat}/${packName}/${itemName}/Render/${coverFile}`;
                }
            }

            // Check for SingleView webms
            const singleViewPath = path.join(renderPath, 'SingleView');
            const webms = {};
            if (fs.existsSync(singleViewPath)) {
                ['MaterialPreview', 'Normal', 'Solid', 'Textured'].forEach(type => {
                    const typePath = path.join(singleViewPath, type);
                    if (fs.existsSync(typePath)) {
                        const files = fs.readdirSync(typePath);
                        const webm = files.find(f => f.endsWith('.webm'));
                        if (webm) {
                            webms[type] = `/assets/3d Assets/${cat}/${packName}/${itemName}/Render/SingleView/${type}/${webm}`;
                        }
                    }
                });
            }

            if (cover) { // Only add if we found a cover or it looks valid
                packObj.items.push({
                    id: itemName.replace(/\s+/g, '-').toLowerCase(),
                    name: itemName,
                    cover: cover,
                    webms: webms
                });
            }
        });

        if (packObj.items.length > 0) {
            // Use the first item's cover as the pack cover if specific pack cover doesn't exist?
            // User asked to use: AnimalKnight_Ant layout.
            // I'll pick the first item's cover as the pack's main image.
            packObj.cover = packObj.items[0].cover;
            catObj.packs.push(packObj);
        }
    });

    output.categories.push(catObj);
});

console.log(JSON.stringify(output, null, 2));
