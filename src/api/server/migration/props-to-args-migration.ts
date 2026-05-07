import type { PlaywrightData, ScreenshotData } from '../../../typings';
import path from 'node:path';
import glob from 'fast-glob';
import { readFileSync, writeFileSync } from 'jsonfile';

interface PropsToArgsMigrationResult {
  changedFiles: string[];
  scannedFiles: number;
}

function hasValues(value?: Record<string, unknown>) {
  return Boolean(value && Object.keys(value).length > 0);
}

function migrateScreenshotPropsToArgs(screenshot: ScreenshotData) {
  if (screenshot.props === undefined) {
    return false;
  }

  const hasArgs = hasValues(screenshot.args);
  const hasProps = hasValues(screenshot.props);

  if (!hasArgs && hasProps) {
    screenshot.args = screenshot.props;
  }

  delete screenshot.props;
  return true;
}

export function migratePropsToArgsData(data: PlaywrightData) {
  let changed = false;

  const { stories } = data;
  if (!stories) {
    return false;
  }

  Object.values(stories).forEach((story) => {
    story.screenshots?.forEach((screenshot) => {
      if (migrateScreenshotPropsToArgs(screenshot)) {
        changed = true;
      }
    });
  });

  return changed;
}

export function runPropsToArgsMigration(cwd = process.cwd()): PropsToArgsMigrationResult {
  const files = glob.sync(['**/*.playwright.json', '!node_modules/**'], {
    absolute: true,
    cwd,
  });
  const changedFiles: string[] = [];

  files.forEach((file) => {
    const data = readFileSync(file) as PlaywrightData;
    const changed = migratePropsToArgsData(data);

    if (!changed) {
      return;
    }

    writeFileSync(file, data, {
      EOL: '\r\n',
      spaces: 2,
    });
    changedFiles.push(path.relative(cwd, file));
  });

  return {
    changedFiles,
    scannedFiles: files.length,
  };
}
