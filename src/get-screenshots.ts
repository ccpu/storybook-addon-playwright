import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';
import { getStoryPlaywrightData } from './api/server/utils';
import { makeScreenshot } from './api/services';
import {
  getScreenshotPaths,
  ScreenshotPathInfo,
} from './api/server/utils/get-screenshot-paths';
import fs from 'fs';
import { RequestData } from './typings/request';
import { setStoryScreenshotOptions } from './api/services/utils/set-story-screenshot-options';

interface RunImageDiffOptions extends RequestData {
  onScreenshotReady?: (
    buffer: Buffer,
    baselineScreenshotPathInfo: ScreenshotPathInfo,
  ) => void;
  playwrightJsonPath?: string;
}

interface GetScreenshot {
  buffer: Buffer;
  storyId: string;
  configFile: string;
}

export const getScreenshots = async (options: RunImageDiffOptions) => {
  const { onScreenshotReady, playwrightJsonPath, requestId } = options;

  const files =
    playwrightJsonPath && fs.existsSync(playwrightJsonPath)
      ? [playwrightJsonPath]
      : await getPlaywrightConfigFiles(playwrightJsonPath);

  const results: GetScreenshot[] = [];

  for (const fileName of files) {
    if (!fileName) continue;

    const storiesData = await getStoryPlaywrightData(fileName);

    for (const story of storiesData.storyData) {
      if (!story) continue;

      if (story.data.screenshots && story.data.screenshots.length) {
        for (const screenShotData of story.data.screenshots) {
          if (!screenShotData) continue;

          setStoryScreenshotOptions(storiesData.playWrightData, screenShotData);

          const screenShot = await makeScreenshot(
            {
              requestId: requestId,
              storyId: story.storyId,
              ...screenShotData,
            },
            false,
          );

          const paths = getScreenshotPaths({
            browserType: screenShotData.browserType,
            filePath: fileName,
            storyId: story.storyId,
            title: screenShotData.title,
          });

          results.push({
            buffer: screenShot.buffer,
            configFile: fileName,
            storyId: story.storyId,
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
