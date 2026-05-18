import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import glob from 'fast-glob';
import { getConfigs } from '../api/server/configs';

interface StorybookIndexEntry {
  importPath?: string;
}

interface StorybookIndexResponse {
  entries?: Record<string, StorybookIndexEntry>;
}

interface GetPlaywrightConfigFilesOptions {
  cwd?: string;
  storybookEndpoint?: string;
}

function getStorybookEndpoint(options: GetPlaywrightConfigFilesOptions) {
  if (options.storybookEndpoint) {
    return options.storybookEndpoint;
  }

  try {
    return getConfigs().storybookEndpoint;
  } catch {
    return undefined;
  }
}

function toPosixPath(filePath: string) {
  return filePath.replace(/\\/g, '/');
}

function getLookupPattern(configPath?: string | '*') {
  return configPath && configPath !== '*' ? configPath : '**/*.playwright.json';
}

function normalizeStoryImportPath(importPath: string) {
  return importPath.split('#')[0]?.split('?')[0] ?? '';
}

function toStoryPath(importPath: string, cwd: string) {
  if (importPath.startsWith('/@fs/')) {
    return path.normalize(importPath.replace('/@fs/', ''));
  }

  return path.resolve(cwd, importPath);
}

function toPlaywrightJsonPath(storyPath: string) {
  const parsed = path.parse(storyPath);
  return path.join(parsed.dir, `${parsed.name}.playwright.json`);
}

function extractImportPaths(indexData: unknown) {
  if (!indexData || typeof indexData !== 'object') {
    return [];
  }

  const entries = (indexData as StorybookIndexResponse).entries;
  if (!entries) {
    return [];
  }

  return Object.values(entries).reduce<string[]>((result, entry) => {
    if (typeof entry.importPath === 'string' && entry.importPath.length > 0) {
      result.push(entry.importPath);
    }

    return result;
  }, []);
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

async function loadStorybookIndex(storybookEndpoint: string) {
  if (isHttpUrl(storybookEndpoint)) {
    const endpoint = storybookEndpoint.endsWith('/')
      ? storybookEndpoint
      : `${storybookEndpoint}/`;
    const indexUrl = new URL('index.json', endpoint).toString();
    const response = await fetch(indexUrl);

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as unknown;
    return extractImportPaths(data);
  }

  const endpointPath = storybookEndpoint.startsWith('file://')
    ? fileURLToPath(storybookEndpoint)
    : path.resolve(storybookEndpoint);
  const indexPath = path.join(endpointPath, 'index.json');

  if (!fs.existsSync(indexPath)) {
    return [];
  }

  const content = await fs.promises.readFile(indexPath, 'utf8');
  const parsed = JSON.parse(content) as unknown;

  return extractImportPaths(parsed);
}

async function getStorybookDerivedFiles(storybookEndpoint: string, cwd: string) {
  try {
    const importPaths = await loadStorybookIndex(storybookEndpoint);
    const files = new Set<string>();

    importPaths.forEach((importPath) => {
      const normalizedImportPath = normalizeStoryImportPath(importPath);
      if (!normalizedImportPath) {
        return;
      }

      const storyPath = toStoryPath(normalizedImportPath, cwd);
      const playwrightFilePath = toPlaywrightJsonPath(storyPath);

      if (!fs.existsSync(playwrightFilePath)) {
        return;
      }

      const relativeFilePath = toPosixPath(path.relative(cwd, playwrightFilePath));
      if (relativeFilePath.length > 0) {
        files.add(relativeFilePath);
      }
    });

    return Array.from(files);
  } catch {
    return [];
  }
}

export async function getPlaywrightConfigFiles(
  configPath?: string | '*',
  options: GetPlaywrightConfigFilesOptions = {},
) {
  const cwd = options.cwd ? path.resolve(options.cwd) : process.cwd();
  const lookupPattern = getLookupPattern(configPath);

  const files = await glob([lookupPattern, '!node_modules/**'], {
    cwd,
  });

  if (configPath && configPath !== '*') {
    return files;
  }

  const storybookEndpoint = getStorybookEndpoint(options);

  if (!storybookEndpoint) {
    return files;
  }

  const storybookDerivedFiles = await getStorybookDerivedFiles(storybookEndpoint, cwd);

  if (!storybookDerivedFiles.length) {
    return files;
  }

  return Array.from(new Set([...files, ...storybookDerivedFiles]));
}
