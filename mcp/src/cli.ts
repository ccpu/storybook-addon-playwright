#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { startServer } from './server.js';

function readVersion(): string {
  // Resolves to the storybook-addon-playwright package.json in both layouts:
  //   dev  : mcp/src/cli.ts        -> ../../package.json (repo root)
  //   built: dist/mcp/cli.mjs      -> ../../package.json (installed package root)
  try {
    const pkgUrl = new URL('../../package.json', import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgUrl, 'utf8')) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

await startServer(readVersion());
