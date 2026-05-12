import type { ScreenshotInfo } from '../../../typings';
import { getStoryPlaywrightFileInfo } from '../../../api/server/utils/get-story-playwright-file-info';
import { loadStoryData } from '../../../api/server/utils/load-story-data';
import { getStoryData } from './get-story-data';
import { normalizeScreenshotActionIds } from './normalize-screenshot-action-ids';
import { setStoryScreenshotOptions } from './set-story-screenshot-options';

export async function getScreenshotData(info: ScreenshotInfo) {
  const fileInfo = getStoryPlaywrightFileInfo(info.filePath);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  if (!storyData) {
    return undefined;
  }

  const story = getStoryData(storyData, info.storyId);

  if (!story || !story.screenshots) {
    return undefined;
  }

  const screenShot = story.screenshots.find((x) => x.id === info.screenshotId);

  if (screenShot) {
    setStoryScreenshotOptions(storyData, screenShot);
    return {
      ...screenShot,
      actionSets: normalizeScreenshotActionIds(screenShot.actionSets),
    };
  }

  return screenShot;
}
