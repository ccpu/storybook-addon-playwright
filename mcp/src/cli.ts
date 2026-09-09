#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { startServer } from './server.js';

/*
 * Candidate package.json locations, in the order they are tried. The same sources
 * are built into three layouts, and each one has to report the version of the
 * package that actually ships it:
 *   standalone : mcp/dist/cli.mjs -> ../package.json    (storybook-addon-playwright-mcp)
 *   dev        : mcp/src/cli.ts   -> ../package.json    (storybook-addon-playwright-mcp)
 *   addon bin  : dist/mcp/cli.js -> ../../package.json (storybook-addon-playwright)
 * The addon layout has no `dist/package.json`, so the first candidate simply misses
 * and the root manifest is used.
 */
const PACKAGE_JSON_CANDIDATES = ['../package.json', '../../package.json'];

function readVersion(): string {
  for (const candidate of PACKAGE_JSON_CANDIDATES) {
    try {
      const pkgUrl = new URL(candidate, import.meta.url);
      const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8')) as { version?: string };
      if (typeof pkg.version === 'string') {
        return pkg.version;
      }
    } catch {
      // Not this layout — try the next candidate.
    }
  }
  return '0.0.0';
}

await startServer(readVersion());
