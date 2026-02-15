const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'assets', 'Ui Ux');
const outputDir = path.join(__dirname, 'src', 'data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const projects = [];

if (fs.existsSync(baseDir)) {
    const projectDirs = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory());

    projectDirs.forEach(dirent => {
        const projectName = dirent.name;
        const projectPath = path.join(baseDir, projectName);
        const files = fs.readdirSync(projectPath)
            .filter(f => /\.(png|jpg|jpeg|gif|webp)$/i.test(f));

        if (files.length > 0) {
            projects.push({
                id: projectName.replace(/\s+/g, '-').toLowerCase(),
                title: projectName.replace(/([A-Z])/g, ' $1').trim(), // Add spaces to CamelCase
                folder: `/assets/Ui Ux/${projectName}`,
                images: files.map(f => `/assets/Ui Ux/${projectName}/${f}`)
            });
        }
    });
}

const outputPath = path.join(outputDir, 'uiux_data.json');
fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
console.log(`Generated ${projects.length} UI/UX projects to ${outputPath}`);
