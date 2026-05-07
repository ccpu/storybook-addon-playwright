#!/usr/bin/env node
// Fix bare `import 'relative-path'` statements that migration script missed.
// For tests that came from src/**/__tests__/ (one deeper than test/**),
// these paths need to be recomputed from the new location.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TEST_DIR = path.join(ROOT, 'test');

const fwd = (p) => p.replace(/\\/g, '/');
const ensureRelative = (p) => {
  const f = fwd(p);
  return f.startsWith('.') ? f : './' + f;
};

function walkDir(dir, pred, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, pred, results);
    else if (pred(entry.name)) results.push(full);
  }
  return results;
}

// Co-located test files (NOT from __tests__) keep the same depth, so their
// bare imports are also correct. Here we only need to fix files that came from
// __tests__/ directories (depth +1).
//
// Strategy: For each test file, we try recomputing bare-import paths using
// the __tests__/ version of the old source directory. If the result differs
// from the current import AND the current import resolves ABOVE the project root
// (i.e. contains too many ..s), we fix it.

async function main() {
  const testFiles = walkDir(TEST_DIR, (name) => /\.test\.(ts|tsx)$/.test(name));
  let fixCount = 0;

  for (const testAbs of testFiles) {
    let content = fs.readFileSync(testAbs, 'utf-8');
    const newDir = path.dirname(testAbs);

    // The old location (if file was in __tests__/) would be:
    // src/<same path hierarchy as test/>/__tests__/<filename>
    const relFromTest = path.relative(TEST_DIR, testAbs);
    const oldDirAsIfInTests = path.join(
      ROOT,
      'src',
      path.dirname(relFromTest),
      '__tests__',
    );

    let changed = false;
    const lines = content.split('\n');
    const newLines = lines.map((line) => {
      // Strip carriage return for matching (CRLF files on Windows)
      const hasCR = line.endsWith('\r');
      const lineClean = hasCR ? line.slice(0, -1) : line;

      // Match bare side-effect imports: import './...' or import '../...'
      const m = lineClean.match(/^(import\s+)(["'])(\.\.?\/[^"']+)\2(\s*;?.*)$/);
      if (!m) return line;
      const [, prefix, quote, importPath, suffix] = m;

      // Check if the current path is already correct from the new location
      const currentAbs = path.resolve(newDir, importPath);
      const currentAbsFwd = fwd(currentAbs);

      // If it goes above ROOT it's definitely wrong
      const rootFwd = fwd(ROOT);
      if (!currentAbsFwd.startsWith(rootFwd)) {
        // Compute correct path using oldDirAsIfInTests as origin
        const correctAbs = path.resolve(oldDirAsIfInTests, importPath);
        const correctRel = ensureRelative(fwd(path.relative(newDir, correctAbs)));
        if (correctRel !== ensureRelative(fwd(importPath))) {
          changed = true;
          fixCount++;
          const oldFwd = fwd(importPath);
          const file = fwd(path.relative(ROOT, testAbs));
          console.log(`  ${file}: '${oldFwd}' -> '${correctRel}'`);
          return prefix + quote + correctRel + quote + suffix + (hasCR ? '\r' : '');
        }
      }

      return line;
    });

    if (changed) {
      fs.writeFileSync(testAbs, newLines.join('\n'), 'utf-8');
    }
  }

  console.log(`\nFixed ${fixCount} bare imports.`);
}

main().catch(console.error);
