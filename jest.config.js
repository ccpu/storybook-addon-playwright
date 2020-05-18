module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],
  coverageDirectory: 'coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // modulePathIgnorePatterns: ['/mocks/', '/utils/'],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  preset: 'ts-jest',
  setupFilesAfterEnv: [
    './setupTests.ts',
    './node_modules/jest-enzyme/lib/index.js',
  ],
};
