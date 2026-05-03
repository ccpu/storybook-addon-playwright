import path from 'path';
import kebabCase from 'lodash/kebabCase';
import { getStoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { DiffImageToScreenShot } from '../../typings';

export interface ScreenshotPathInfo {
  diffDir: string;
  filePath: string;
  screenshotIdentifier: string;
  screenshotsDir: string;
}

export const getScreenshotPaths = (data: DiffImageToScreenShot) => {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);

  const screenshotIdentifier = kebabCase(
    `${path.basename(data.storyId)}--${data.title}--${data.browserType}`,
  );

  const diffDir = path.join(fileInfo.screenShotsDir, '__diff_output__');

  const filePath = path.join(
    fileInfo.screenShotsDir,
    screenshotIdentifier + '-snap.png',
  );

  return {
    diffDir,
    filePath,
    screenshotIdentifier,
    screenshotsDir: fileInfo.screenShotsDir,
  };
};
