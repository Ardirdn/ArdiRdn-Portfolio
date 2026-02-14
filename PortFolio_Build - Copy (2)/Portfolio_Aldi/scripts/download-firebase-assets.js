import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../public/data');
const ASSETS_DIR = path.join(__dirname, '../public/assets');

const downloadFile = (url, destPath) => {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            // Handle Redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                if (!res.headers.location) {
                    reject(new Error(`Redirect with no location header for ${url}`));
                    return;
                }
                downloadFile(res.headers.location, destPath)
                    .then(resolve)
                    .catch(reject);
                return;
            }

            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download: ${res.statusCode} ${url}`));
                return;
            }

            const file = fs.createWriteStream(destPath);
            res.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });

            file.on('error', (err) => {
                fs.unlink(destPath, () => { });
                reject(err);
            });
        });

        req.on('error', (err) => {
            fs.unlink(destPath, () => { });
            reject(err);
        });
    });
};

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const processFile = async (filename) => {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return;

    console.log(`Reading ${filename}...`);
    let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changes = 0;

    const walk = async (node) => {
        for (const key in node) {
            if (typeof node[key] === 'string' && node[key].includes('firebasestorage.googleapis.com')) {
                const url = node[key];

                // Extract filename
                let assetName = 'file';
                try {
                    const u = new URL(url);
                    const parts = u.pathname.split('/o/');
                    if (parts.length > 1) {
                        assetName = decodeURIComponent(parts[1]);
                    }
                } catch (e) { }

                // Sanitize path (remove any potential '..')
                assetName = assetName.replace(/\.\./g, '');

                // Determine Local Paths
                // assets/FolderName/FileName.png

                const localRelPath = path.join('assets', assetName);
                const absDestPath = path.join(path.dirname(DATA_DIR), localRelPath);

                ensureDir(path.dirname(absDestPath));

                // Don't redownload if exists
                if (!fs.existsSync(absDestPath)) {
                    console.log(`Downloading: ${assetName}`);
                    try {
                        await downloadFile(url, absDestPath);
                    } catch (err) {
                        console.error(`Error downloading ${assetName}:`, err.message);
                        continue; // Skip updating JSON if download failed
                    }
                } else {
                    // console.log(`Skipping existing: ${assetName}`);
                }

                // Update content in JSON
                // Must ensure forward slashes for URL usage
                node[key] = '/' + localRelPath.replace(/\\/g, '/');
                changes++;
            } else if (typeof node[key] === 'object' && node[key] !== null) {
                await walk(node[key]);
            }
        }
    };

    if (Array.isArray(content)) {
        for (const item of content) await walk(item);
    } else {
        await walk(content);
    }

    if (changes > 0) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
        console.log(`Updated ${filename}: ${changes} references updated.`);
    } else {
        console.log(`No changes for ${filename}.`);
    }
};

const main = async () => {
    ensureDir(ASSETS_DIR);
    console.log("Starting download process...");
    await processFile('projects.json');
    await processFile('tools.json');
    console.log("All done.");
};

main().catch(err => console.error(err));
