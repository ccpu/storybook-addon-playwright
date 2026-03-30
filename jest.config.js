module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // modulePathIgnorePatterns: ['/mocks/', '/utils/'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  preset: 'ts-jest',
  setupFiles: ['./setupTests.polyfills.js'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // tRPC client mock for all test files
    '^(.*)/trpc/client$': '<rootDir>/src/trpc/__mocks__/client.ts',
    // Storybook 8 uses subpath exports which Jest 27 doesn't support.
    // Map storybook/internal/* paths to @storybook/core dist files.
    '^storybook/internal/manager-api$':
      '<rootDir>/node_modules/@storybook/core/dist/manager-api/index.cjs',
    '^storybook/internal/components$':
      '<rootDir>/node_modules/@storybook/core/dist/components/index.cjs',
    '^storybook/internal/theming$':
      '<rootDir>/node_modules/@storybook/core/dist/theming/index.cjs',
    '^storybook/internal/theming/create$':
      '<rootDir>/node_modules/@storybook/core/dist/theming/create.cjs',
    '^storybook/internal/core-events$':
      '<rootDir>/node_modules/@storybook/core/dist/core-events/index.cjs',
    '^storybook/internal/channels$':
      '<rootDir>/node_modules/@storybook/core/dist/channels/index.cjs',
    '^storybook/internal/types$':
      '<rootDir>/node_modules/@storybook/core/dist/types/index.cjs',
    '^storybook/internal/client-logger$':
      '<rootDir>/node_modules/@storybook/core/dist/client-logger/index.cjs',
  },
  setupFilesAfterEnv: [
    './setupTests.ts',
    './node_modules/jest-enzyme/lib/index.js',
  ],
  transformIgnorePatterns: ['/node_modules/(?!(p-limit|yocto-queue)/)'],
  testPathIgnorePatterns: ['./stories/*'],
};
