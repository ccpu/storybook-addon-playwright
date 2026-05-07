import glob from 'fast-glob';

export async function getPlaywrightConfigFiles(configPath?: string | '*') {
  const files = await glob([
    configPath && configPath !== '*' ? configPath : '**/*.playwright.json',
    '!node_modules/**',
  ]);

  return files;
}
