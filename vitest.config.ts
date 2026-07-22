import { defineConfig } from 'vitest/config';
// import react from '@vitejs/plugin-react';
import path from 'path';
// import { vitestJestMockCompatPlugin } from './src/test-utils/vitest-jest-mock-compat';

export default defineConfig({
  plugins: [
    // Must come before react() so that jest.mock hoisting is applied first
    // vitestJestMockCompatPlugin(),
    // react(),
  ],
  resolve: {
    alias: [
      // ts-jest/utils compatibility shim – replaces mocked() from ts-jest
      {
        find: 'ts-jest/utils',
        replacement: path.resolve(__dirname, 'src/test-utils/vitest-compat.ts'),
      },
      // Prevent the real compiled tRPC router (which transitively imports sharp)
      // from loading during tests. This mirrors jest's CJS require interception
      // for the middleware.test.js test.
      {
        find: /dist[/\\]trpc[/\\]router(\.js)?$/,
        replacement: path.resolve(__dirname, '__mocks__/dist-trpc-router.cjs'),
      },
      // Prevent the real compiled tRPC context from loading during tests.
      {
        find: /dist[/\\]trpc[/\\]context(\.js)?$/,
        replacement: path.resolve(__dirname, '__mocks__/dist-trpc-context.cjs'),
      },
      // Always use the mock version of join-images (mirrors jest moduleNameMapper)
      {
        find: /^join-images$/,
        replacement: path.resolve(__dirname, '__mocks__/join-images.ts'),
      },
    ],
  },
  test: {
    coverage: {
      exclude: ['src/**/*.d.ts'],
      include: ['src/**/*.{ts,tsx,js,jsx}'],
      provider: 'v8',
      reporter: ['text', 'clover', 'json', 'lcov'],
      reportsDirectory: './coverage',
    },
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/stories/**',
      'middleware.test.js',
      // The `mcp/` folder is a self-contained package with its own vitest config.
      'mcp/**',
    ],
    globals: true,
    pool: 'vmThreads',
    useAtomics: true,
    server: {
      deps: {
        // Process ESM-only packages through Vite (mirrors transformIgnorePatterns)
        // jsonfile is inlined so Vite creates live named-export bindings, enabling
        // jest.spyOn(jsonfile, 'writeFileSync') to intercept destructured imports.
        inline: [
          'p-limit',
          'yocto-queue',
          'jsonfile',
          // React 17 + Node ESM cannot resolve extensionless `react/jsx-runtime`
          // for some modern ESM bundles unless Vite processes them.
          '@tanstack/react-query',
          '@trpc/react-query',
          'react-split-pane',
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
