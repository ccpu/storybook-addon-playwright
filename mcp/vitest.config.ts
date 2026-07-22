import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Pin the root to this folder so the config works whether it is run from here
  // or driven from the repo root (`vitest --config mcp/vitest.config.ts`).
  root: import.meta.dirname,
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
