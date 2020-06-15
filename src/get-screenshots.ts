import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';
import { ImageDiffResult } from './api/typings';
import { getStoryPlaywrightData } from './api/server/utils';
import { makeScreenshot } from './api/server/services';
import {
  getScreenshotPaths,
  ScreenshotPathInfo,
} from './api/server/utils/get-screenshot-paths';
import fs from 'fs';

interface RunImageDiffOptions {
  onScreenshotReady?: (
    buffer: Buffer,
    baselineScreenshotPathInfo: ScreenshotPathInfo,
  ) => void;
  playwrightJsonPath?: string;
}

export const getScreenshots = async (options: RunImageDiffOptions) => {
  const { onScreenshotReady, playwrightJsonPath } = options;

  const files = fs.existsSync(playwrightJsonPath)
    ? [playwrightJsonPath]
    : await getPlaywrightConfigFiles(playwrightJsonPath);

  const results: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];

    const storiesData = await getStoryPlaywrightData(fileName);

    for (let i = 0; i < storiesData.length; i++) {
      const story = storiesData[i];
      if (story.data.screenshots && story.data.screenshots.length) {
        for (let s = 0; s < story.data.screenshots.length; s++) {
          const screenShotData = story.data.screenshots[s];

          const screenShot = await makeScreenshot(
            {
              storyId: story.storyId,
              ...screenShotData,
            },
            false,
          );

          const paths = getScreenshotPaths({
            browserType: screenShotData.browserType,
            fileName,
            storyId: story.storyId,
            title: screenShotData.title,
          });

          if (onScreenshotReady) {
            await onScreenshotReady(screenShot.buffer, paths);
          }
        }
      }
    }
  }

  return results;
};
