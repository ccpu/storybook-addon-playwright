import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';
import { getStoryPlaywrightData } from './api/server/utils';
import { makeScreenshot } from './api/server/services';
import {
  getScreenshotPaths,
  ScreenshotPathInfo,
} from './api/server/utils/get-screenshot-paths';
import fs from 'fs';
import { RequestData } from './typings/request';
import { setStoryScreenshotOptions } from './api/server/services/utils/set-story-screenshot-options';

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

  const files = fs.existsSync(playwrightJsonPath)
    ? [playwrightJsonPath]
    : await getPlaywrightConfigFiles(playwrightJsonPath);

  const results: GetScreenshot[] = [];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];

    const storiesData = await getStoryPlaywrightData(fileName);

    for (let i = 0; i < storiesData.storyData.length; i++) {
      const story = storiesData.storyData[i];

      if (story.data.screenshots && story.data.screenshots.length) {
        for (let s = 0; s < story.data.screenshots.length; s++) {
          const screenShotData = story.data.screenshots[s];

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
            fileName,
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
