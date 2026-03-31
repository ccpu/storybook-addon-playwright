import { defineConfig } from 'vitest/config';
import path from 'path';

// Lightweight config for middleware.test.js which must run in the forks pool
// so the Module._load patch (in setupTests.vitest-globals.ts) can intercept
// CJS require() chains.
export default defineConfig({
  resolve: {
    alias: [
      {
        find: 'ts-jest/utils',
        replacement: path.resolve(__dirname, 'src/test-utils/vitest-compat.ts'),
      },
      {
        find: /dist[/\\]trpc[/\\]router(\.js)?$/,
        replacement: path.resolve(__dirname, '__mocks__/dist-trpc-router.cjs'),
      },
      {
        find: /dist[/\\]trpc[/\\]context(\.js)?$/,
        replacement: path.resolve(__dirname, '__mocks__/dist-trpc-context.cjs'),
      },
      {
        find: /^join-images$/,
        replacement: path.resolve(__dirname, '__mocks__/join-images.ts'),
      },
    ],
  },
  test: {
    include: ['middleware.test.js'],
    environment: 'jsdom',
    globals: true,
    pool: 'forks',
    server: {
      deps: {
        inline: [
          'p-limit',
          'yocto-queue',
          'jsonfile',
          /middleware\.js$/,
          /dist[/\\]trpc[/\\]/,
        ],
      },
    },
    setupFiles: [
      './setupTests.polyfills.js',
      './setupTests.vitest-globals.ts',
      './setupTests.automocks.ts',
      './setupTests.ts',
    ],
  },
});
