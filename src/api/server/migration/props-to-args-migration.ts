import path from 'path';
import glob from 'fast-glob';
import { readFileSync, writeFileSync } from 'jsonfile';
import { PlaywrightData, ScreenshotData } from '../../../typings';

interface PropsToArgsMigrationResult {
  changedFiles: string[];
  scannedFiles: number;
}

const hasValues = (value?: Record<string, unknown>) =>
  Boolean(value && Object.keys(value).length > 0);

const migrateScreenshotPropsToArgs = (screenshot: ScreenshotData) => {
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
};

export const migratePropsToArgsData = (data: PlaywrightData) => {
  let changed = false;

  const stories = data.stories;
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
};

export const runPropsToArgsMigration = (
  cwd = process.cwd(),
): PropsToArgsMigrationResult => {
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
};
