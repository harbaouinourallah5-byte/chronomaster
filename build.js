const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

// Clean and recreate dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy all static assets to dist
const filesToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'sample_data.js',
  'README.md',
  'lancer_demo.bat'
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${file} -> dist/${file}`);
  }
});

console.log('✅ Build successful! All files ready in dist/ directory.');
