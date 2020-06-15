import path from 'path';
import kebabCase from 'lodash/kebabCase';
import { getStoryPlaywrightFileInfo } from './get-story-playwright-file-info';
import { DiffImageToScreenShot } from '../../typings';

export interface ScreenshotPathInfo {
  diffDir: string;
  fileName: string;
  screenshotIdentifier: string;
  screenshotsDir: string;
}

export const getScreenshotPaths = (data: DiffImageToScreenShot) => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const screenshotsDir = path.join(fileInfo.dir, '__screenshots__');
  const screenshotIdentifier = kebabCase(
    `${path.basename(data.storyId)}--${data.title}--${data.browserType}`,
  );

  const diffDir = path.join(screenshotsDir, '__diff_output__');

  const fileName = path.join(
    screenshotsDir,
    screenshotIdentifier + '-snap.png',
  );

  return {
    diffDir,
    fileName,
    screenshotIdentifier,
    screenshotsDir,
  };
};
