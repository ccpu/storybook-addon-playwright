import glob from 'fast-glob';

export const getPlaywrightConfigFiles = async (configPath?: string | '*') => {
  const files = await glob([
    configPath && configPath !== '*' ? configPath : '**/*.playwright.json',
    '!node_modules/**',
  ]);

  return files;
};
