import glob from 'fast-glob';

export const getPlaywrightConfigFiles = async (path?: string) => {
  const files = await glob([
    path ? path : '**/*.playwright.json',
    '!node_modules/**',
  ]);
  return files;
};
