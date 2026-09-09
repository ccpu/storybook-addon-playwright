import { defineConfig } from 'tsup';

/*
 * Build for the standalone `storybook-addon-playwright-mcp` package.
 *
 * The same `mcp/src` sources are ALSO bundled by the addon's root tsup config into
 * `dist/mcp/cli.js`, so the addon keeps exposing the server as a second bin for
 * projects that already depend on it. Only the output layout differs; keep the two
 * builds in sync when changing targets or externals.
 *
 * ESM only: the entry uses top-level await and `import.meta.url`. `@modelcontextprotocol/sdk`
 * and `zod` stay external — both are runtime dependencies of this package, and the SDK
 * pulls in CJS deps (ajv) that use dynamic require and cannot be safely ESM-bundled.
 */
export default defineConfig({
  entry: { cli: 'src/cli.ts' },
  format: ['esm'],
  // Explicit `.mjs` so the bin stays unambiguously ESM regardless of the package `type`.
  outExtension: () => ({ js: '.mjs' }),
  platform: 'node',
  target: 'node18',
  clean: true,
  dts: false,
  minify: false,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['@modelcontextprotocol/sdk', 'zod'],
});
