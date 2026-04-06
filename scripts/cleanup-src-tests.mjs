#!/usr/bin/env node
// Remove all remaining test files from src/ directory
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function del(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      del(full);
    } else if (/\.test\.(ts|tsx)$/.test(entry.name)) {
      fs.rmSync(full);
      console.log('Deleted:', full.replace(ROOT + path.sep, ''));
    }
  }
}

del(SRC);
console.log('Done.');
