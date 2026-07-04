import fs from 'fs';
import path from 'path';

const artifactsDir = 'C:\\Users\\Server\\.gemini\\antigravity-ide\\brain\\600d9374-0b9f-4691-8199-c99f07a84743';
const destDir = path.join(process.cwd(), 'public');
const dest = path.join(destDir, 'logo.png');

try {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  if (fs.existsSync(artifactsDir)) {
    const files = fs.readdirSync(artifactsDir)
      .filter(f => f.startsWith('media__') && (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')))
      .map(f => ({
        name: f,
        path: path.join(artifactsDir, f),
        time: fs.statSync(path.join(artifactsDir, f)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time); // Sort newest first

    if (files.length > 0) {
      const latestImage = files[0];
      fs.copyFileSync(latestImage.path, dest);
      console.log('\x1b[32m%s\x1b[0m', '✓ Logo successfully copied to public/logo.png!');
      console.log(`Source file: ${latestImage.name} (${new Date(latestImage.time).toLocaleTimeString()})`);
    } else {
      console.error('\x1b[31m%s\x1b[0m', '✗ No uploaded logo image found in artifacts directory.');
    }
  } else {
    console.error('\x1b[31m%s\x1b[0m', '✗ Artifacts directory not found.');
  }
} catch (err) {
  console.error('Error copying logo:', err);
}
