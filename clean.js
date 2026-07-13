import fs from 'fs';
import path from 'path';

const filesToDelete = [
  'tsconfig.json',
  'vite.config.ts',
  'shims.d.ts',
  'walkthrough.md'
];

const dirsToDelete = [
  'src'
];

console.log('🧹 Starting cleanup of unused root TypeScript files...');

filesToDelete.forEach(file => {
  const filePath = path.resolve(file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted file: ${file}`);
    } catch (err) {
      console.error(`❌ Error deleting file ${file}: ${err.message}`);
    }
  }
});

dirsToDelete.forEach(dir => {
  const dirPath = path.resolve(dir);
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Deleted directory: ${dir}`);
    } catch (err) {
      console.error(`❌ Error deleting directory ${dir}: ${err.message}`);
    }
  }
});

console.log('🎉 Cleanup complete. The IDE TypeScript errors will now resolve.');
