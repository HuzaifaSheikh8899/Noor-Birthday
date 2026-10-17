/**
 * Copies web assets into www/ for Capacitor (avoids syncing node_modules).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');

const files = ['index.html', 'style.css', 'script.js', 'birthday-music.mp3'];
const dirs = ['photos'];

function rmDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

require('./generate-assets.js');

rmDir(www);
fs.mkdirSync(www, { recursive: true });

files.forEach((file) => {
  const src = path.join(root, file);
  if (!fs.existsSync(src)) {
    console.warn(`Warning: missing ${file} — run npm install to generate placeholders.`);
    return;
  }
  copyFile(src, path.join(www, file));
});

dirs.forEach((dir) => {
  const src = path.join(root, dir);
  if (fs.existsSync(src)) copyDir(src, path.join(www, dir));
});

console.log('Web assets copied to www/');
