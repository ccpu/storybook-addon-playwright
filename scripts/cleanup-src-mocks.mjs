#!/usr/bin/env node
// Remove all remaining mock and test files from src/
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const fwd = (p) => p.replace(/\\/g, '/');

function del(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const fullFwd = fwd(full);
    if (entry.isDirectory()) {
      // If this is a __mocks__ or __tests__ directory, delete entire tree
      if (entry.name === '__mocks__' || entry.name === '__tests__') {
        fs.rmSync(full, { recursive: true });
        console.log('Deleted dir:', full.replace(ROOT + path.sep, ''));
      } else {
        del(full);
      }
    }
  }
}

del(SRC);
console.log('Done.');
