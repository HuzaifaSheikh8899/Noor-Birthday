/**
 * Creates placeholder photos and music if missing.
 * Replace photos/*.jpg and birthday-music.mp3 with your own files anytime.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const photosDir = path.join(root, 'photos');

// Minimal valid JPEG (soft pink placeholder, ~631 bytes)
const PLACEHOLDER_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAoADwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKAP/2Q==',
  'base64'
);

// Tiny silent MP3 loop placeholder (~500ms) — replace with birthday-music.mp3
const PLACEHOLDER_MP3 = Buffer.from(
  '//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////8AAABQTEFNRTMuMTAwA8MAAAAAABQgJAUHQQAB9AAAAnEBEZGF0YQAAAAA=',
  'base64'
);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeIfMissing(filePath, data) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, data);
  return true;
}

ensureDir(photosDir);

const photoNames = ['photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg'];
let created = 0;

photoNames.forEach((name) => {
  const p = path.join(photosDir, name);
  if (writeIfMissing(p, PLACEHOLDER_JPEG)) created++;
});

const musicPath = path.join(root, 'birthday-music.mp3');
if (writeIfMissing(musicPath, PLACEHOLDER_MP3)) created++;

if (created > 0) {
  console.log(`Generated ${created} placeholder asset(s). Add your real photos and birthday-music.mp3 when ready.`);
} else {
  console.log('Assets already present (photos + music).');
}
