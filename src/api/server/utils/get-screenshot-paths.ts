import type { DiffImageToScreenShot } from '../../typings';
import path from 'node:path';
import kebabCase from 'lodash/kebabCase';
import { getStoryPlaywrightFileInfo } from './get-story-playwright-file-info';

export interface ScreenshotPathInfo {
  diffDir: string;
  filePath: string;
  screenshotIdentifier: string;
  screenshotsDir: string;
}

export function getScreenshotPaths(data: DiffImageToScreenShot) {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);

  const screenshotIdentifier = kebabCase(
    `${path.basename(data.storyId)}--${data.title}--${data.browserType}`,
  );

  const diffDir = path.join(fileInfo.screenShotsDir, '__diff_output__');

  const filePath = path.join(fileInfo.screenShotsDir, `${screenshotIdentifier}-snap.png`);

  return {
    diffDir,
    filePath,
    screenshotIdentifier,
    screenshotsDir: fileInfo.screenShotsDir,
  };
}
