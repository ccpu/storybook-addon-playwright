#!/usr/bin/env node
// Migration script: move all test files from src/ __tests__ dirs and co-located
// *.test.ts(x) files to a top-level test/ directory, mirroring the src/ hierarchy.
// Also moves __mocks__ directories from src/ to test/.
//
// For vi.mock('path') calls without a factory that rely on __mocks__ auto-resolution,
// adds an explicit async factory pointing to the new mock location in test/.
//
// Usage: node scripts/migrate-tests.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const TEST_DIR = path.join(ROOT, 'test');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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
    else if (pred(entry.name, full)) results.push(full);
  }
  return results;
}

function newTestPath(oldAbs) {
  const rel = path.relative(SRC, oldAbs);
  const clean = rel
    .replace(/[\\/]__tests__[\\/]/g, path.sep)
    .replace(/^__tests__[\\/]/, '');
  return path.join(TEST_DIR, clean);
}

function newMockPath(oldAbs) {
  const rel = path.relative(SRC, oldAbs);
  return path.join(TEST_DIR, rel);
}

function rewriteRelative(importPath, oldDir, newDir) {
  if (!importPath.startsWith('.')) return importPath;
  const abs = path.resolve(oldDir, importPath);
  const rel = path.relative(newDir, abs);
  return ensureRelative(fwd(rel));
}

function findMockFile(resolvedModuleAbs) {
  const dir = path.dirname(resolvedModuleAbs);
  const base = path
    .basename(resolvedModuleAbs)
    .replace(/\.(ts|tsx|js|jsx)$/, '');
  const mockDir = path.join(dir, '__mocks__');
  for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
    const candidate = path.join(mockDir, base + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function pruneEmptyDirs(dir) {
  if (!dir.startsWith(SRC)) return;
  try {
    const entries = fs.readdirSync(dir);
    if (entries.length === 0) {
      fs.rmdirSync(dir);
      pruneEmptyDirs(path.dirname(dir));
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Content transformer
// ---------------------------------------------------------------------------

function transformContent(content, oldAbs, newAbs, isTest) {
  const oldDir = path.dirname(oldAbs);
  const newDir = path.dirname(newAbs);

  // Step 1: Rewrite all relative paths in import/export/require/vi.mock
  // Process line by line so we skip comment lines
  let result = content
    .split('\n')
    .map((line) => {
      if (line.trimStart().startsWith('//')) return line;
      return line.replace(
        /((?:from|require\(|vi\.mock\()\s*)(["'])(\.\.?\/[^"']+)\2/g,
        (_m, prefix, quote, importPath) =>
          prefix + quote + rewriteRelative(importPath, oldDir, newDir) + quote,
      );
    })
    .join('\n');

  // Step 2 (test files only): inject async factory for vi.mock calls that
  // have no factory but have a corresponding __mocks__ file.
  //
  // Handles single-line:   vi.mock('path');
  // And multi-line:        vi.mock(
  //                          'path',
  //                        );
  if (isTest) {
    // Regex explanation:
    //   ^([ \t]*)           leading whitespace (line must start with optional ws only)
    //   vi\.mock\(          literal "vi.mock("
    //   \s*                 optional whitespace / newline
    //   (["'])              opening quote  (group 3)
    //   (\.\.?\/[^"']+)     relative path (group 4)
    //   \3                  matching closing quote
    //   \s*,?\s*            optional trailing comma + whitespace
    //   \)                  closing paren
    //   ([ \t]*;?)          optional semicolon  (group 5)
    //
    // The `m` flag makes ^ match the start of each line.
    // Non-comment lines only — by anchoring to line start with `[ \t]*` we
    // exclude `// vi.mock(...)` comment lines because they'd start with `//`.
    result = result.replace(
      /^([ \t]*)(vi\.mock\(\s*(["'])(\.\.?\/[^"']+)\3\s*,?\s*\))([ \t]*;?)/gm,
      (_match, indent, _viMockFull, quote, transformedPath, semi) => {
        const absModule = path.resolve(newDir, transformedPath);
        const mockFileSrc = findMockFile(absModule);
        if (!mockFileSrc) return _match;

        const mockFileTest = newMockPath(mockFileSrc);
        const relToMock = ensureRelative(
          fwd(path.relative(newDir, mockFileTest)),
        );
        const relToMockNoExt = relToMock.replace(/\.(ts|tsx)$/, '');
        const cleanPath = transformedPath.replace(/\.ts$/, '');

        return `${indent}vi.mock(${quote}${cleanPath}${quote}, async () => await import('${relToMockNoExt}'));`;
      },
    );
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const testFiles = walkDir(SRC, (name) => /\.test\.(ts|tsx)$/.test(name));
  const mockFiles = walkDir(SRC, (_name, full) =>
    fwd(full).split('/').includes('__mocks__'),
  );

  console.log(`Test files : ${testFiles.length}`);
  console.log(`Mock files : ${mockFiles.length}`);
  console.log('');

  for (const oldAbs of testFiles) {
    const newAbs = newTestPath(oldAbs);
    const content = fs.readFileSync(oldAbs, 'utf-8');
    const newContent = transformContent(content, oldAbs, newAbs, true);

    fs.mkdirSync(path.dirname(newAbs), { recursive: true });
    fs.writeFileSync(newAbs, newContent, 'utf-8');
    fs.rmSync(oldAbs);
    pruneEmptyDirs(path.dirname(oldAbs));

    console.log(`[TEST]  -> ${fwd(path.relative(ROOT, newAbs))}`);
  }

  for (const oldAbs of mockFiles) {
    const newAbs = newMockPath(oldAbs);
    const content = fs.readFileSync(oldAbs, 'utf-8');
    const newContent = transformContent(content, oldAbs, newAbs, false);

    fs.mkdirSync(path.dirname(newAbs), { recursive: true });
    fs.writeFileSync(newAbs, newContent, 'utf-8');
    fs.rmSync(oldAbs);
    pruneEmptyDirs(path.dirname(oldAbs));

    console.log(`[MOCK]  -> ${fwd(path.relative(ROOT, newAbs))}`);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
