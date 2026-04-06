#!/usr/bin/env node
// Fix path issues in test/api/services/ - pre-existing bugs preserved by migration

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function walkDir(dir, pred, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, pred, results);
    else if (pred(entry.name, full)) results.push(full);
  }
  return results;
}

const TARGET = path.join(ROOT, 'test', 'api', 'services');

const testFiles = walkDir(TARGET, (name) =>
  /\.(test|spec)\.(ts|tsx)$/.test(name),
);

console.log(`Found ${testFiles.length} test files in test/api/services/`);

const replacements = [
  // Depth fix: 4 levels up should be 3 from test/api/services/
  ["'../../../../configs/", "'../../../configs/"],
  ["'../../../../manual-mocks/", "'../../../manual-mocks/"],
  // Path fix: src/api/utils -> src/api/server/utils
  ['src/api/utils/', 'src/api/server/utils/'],
  ["src/api/utils'", "src/api/server/utils'"],
  // Path fix: src/api/configs -> src/api/server/configs
  ["src/api/configs'", "src/api/server/configs'"],
  // Path fix: ../../../utils/ -> ../../../src/utils/ (for test/api/services/ depth)
  ["'../../../utils/", "'../../../src/utils/"],
];

// Factory injection for vi.mock calls that need __mocks__ files
// For files at depth test/api/services/ (3 levels deep)
const factoryReplacementsDepth3 = [
  [
    "vi.mock('../../../src/api/server/utils/load-story-data');",
    "vi.mock('../../../src/api/server/utils/load-story-data', async () => await import('../server/utils/__mocks__/load-story-data'));",
  ],
  [
    "vi.mock('../../../src/api/server/utils/save-story-file');",
    "vi.mock('../../../src/api/server/utils/save-story-file', async () => await import('../server/utils/__mocks__/save-story-file'));",
  ],
  [
    "vi.mock('../../../src/api/server/configs');",
    "vi.mock('../../../src/api/server/configs', async () => await import('../server/__mocks__/configs'));",
  ],
  [
    "vi.mock('../../../src/api/server/utils/execute-action');",
    "vi.mock('../../../src/api/server/utils/execute-action', async () => await import('../server/utils/__mocks__/execute-action'));",
  ],
  [
    "vi.mock('../../../src/api/server/utils/install-mouse-helper.ts');",
    "vi.mock('../../../src/api/server/utils/install-mouse-helper.ts', async () => await import('../server/utils/__mocks__/install-mouse-helper'));",
  ],
];

// For files at depth test/api/services/utils/ (4 levels deep)
const factoryReplacementsDepth4 = [
  [
    "vi.mock('../../../../src/api/server/utils/load-story-data.ts');",
    "vi.mock('../../../../src/api/server/utils/load-story-data.ts', async () => await import('../../server/utils/__mocks__/load-story-data'));",
  ],
];

let totalFixed = 0;

for (const filePath of testFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Apply string replacements
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
      console.log(
        `  [path] ${from} -> ${to} in ${path.relative(ROOT, filePath)}`,
      );
    }
  }

  // Apply factory injections based on depth
  const relPath = path.relative(
    path.join(ROOT, 'test', 'api', 'services'),
    filePath,
  );
  const depth = relPath.split(path.sep).length;
  const factoryReplacements =
    depth === 1 ? factoryReplacementsDepth3 : factoryReplacementsDepth4;

  for (const [from, to] of factoryReplacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
      changed = true;
      console.log(
        `  [factory] ${from.slice(0, 60)}... in ${path.relative(
          ROOT,
          filePath,
        )}`,
      );
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
  }
}

console.log(`\nFixed ${totalFixed} files.`);
