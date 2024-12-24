const fs = require('fs');
const path = require('path');

// Ensure required directories exist
const dirs = ['dist', 'dist/config', 'dist/routes', 'dist/models', 'dist/middleware', 'dist/utils'];
dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

// Copy necessary files to dist
const filesToCopy = [
    { src: 'server.js', dest: 'dist/server.js' },
    { src: 'config/production.js', dest: 'dist/config/production.js' },
    { src: 'models/User.js', dest: 'dist/models/User.js' },
    { src: 'models/Application.js', dest: 'dist/models/Application.js' },
    { src: 'routes/auth.js', dest: 'dist/routes/auth.js' },
    { src: 'routes/applications.js', dest: 'dist/routes/applications.js' },
    { src: 'middleware/auth.js', dest: 'dist/middleware/auth.js' },
    { src: 'utils/emailService.js', dest: 'dist/utils/emailService.js' },
    { src: 'utils/scheduler.js', dest: 'dist/utils/scheduler.js' }
];

filesToCopy.forEach(({ src, dest }) => {
    const sourcePath = path.join(__dirname, '..', src);
    const destPath = path.join(__dirname, '..', dest);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied ${src} to ${dest}`);
    } else {
        console.error(`Source file not found: ${src}`);
    }
});

// Create production package.json
const packageJson = require('../package.json');
const productionPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    main: 'server.js',
    scripts: {
        start: 'node server.js'
    },
    dependencies: packageJson.dependencies,
    engines: {
        node: '>=14.0.0'
    }
};

fs.writeFileSync(
    path.join(__dirname, '../dist/package.json'),
    JSON.stringify(productionPackageJson, null, 2)
);

console.log('Build completed successfully!');
