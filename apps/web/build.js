const fs = require('fs');
const path = require('path');

const webDir = __dirname;
const distDir = path.join(webDir, 'dist');
const publicDir = path.join(webDir, 'public');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('[build] Preparing production build for Vercel & static hosting...');

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. HTML files to copy
const htmlFiles = ['index.html', 'projects.html', 'resume.html'];
htmlFiles.forEach((file) => {
  const srcFile = path.join(webDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(distDir, file));
    fs.copyFileSync(srcFile, path.join(publicDir, file));
    
    console.log(`[build] Copied ${file} -> dist/ and public/`);
  }
});

// 3. Copy src (CSS, JS)
copyRecursiveSync(path.join(webDir, 'src'), path.join(distDir, 'src'));
copyRecursiveSync(path.join(webDir, 'src'), path.join(publicDir, 'src'));
console.log('[build] Copied src/ -> dist/src/ and public/src/');

// 4. Copy assets from public/assets to dist/public/assets and dist/assets
if (fs.existsSync(path.join(publicDir, 'assets'))) {
  copyRecursiveSync(path.join(publicDir, 'assets'), path.join(distDir, 'public', 'assets'));
  copyRecursiveSync(path.join(publicDir, 'assets'), path.join(distDir, 'assets'));
  // Also create a public/public link so "public/assets/..." works even if public is the web root
  copyRecursiveSync(path.join(publicDir, 'assets'), path.join(publicDir, 'public', 'assets'));
  console.log('[build] Synchronized assets to dist/ and public/ aliases');
}

// 5. Copy root project images to dist/ and public/
const projectImages = [
  'carpool-project.jpg',
  'shivra-project.jpg',
  'universal-ui-project.jpg',
  'mailofly-project.jpg',
  's2s-project.jpg',
  'codechef-project.jpg',
  'image_26be75.jpg'
];

projectImages.forEach((img) => {
  const srcPath = path.join(webDir, img);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distDir, img));
    fs.copyFileSync(srcPath, path.join(publicDir, img));
  } else {
    // Check in public/assets/images
    const altPath = path.join(publicDir, 'assets', 'images', img);
    if (fs.existsSync(altPath)) {
      fs.copyFileSync(altPath, path.join(distDir, img));
      fs.copyFileSync(altPath, path.join(publicDir, img));
    }
  }
});

console.log('[build] Production build completed successfully!');
