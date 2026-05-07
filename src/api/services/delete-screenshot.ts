import type { ScreenshotData, ScreenshotInfo } from '../../typings';

import * as fs from 'node:fs';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { getScreenshotPaths } from '../server/utils/get-screenshot-paths';
import { deleteStoryOptions, getStoryData } from './utils';

export async function deleteScreenshot(
  data: ScreenshotInfo,
): Promise<ScreenshotData[] | undefined> {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId, false);

  if (!storyData) {
    return undefined;
  }

  const story = getStoryData(storyData, data.storyId);

  if (!story || !story.screenshots || !story.screenshots.length) return [];

  const screenshotInfo = story.screenshots.find(
    (x) => x.id === data.screenshotId,
  );

  if (!screenshotInfo) {
    return story.screenshots;
  }

  const paths = getScreenshotPaths({
    browserType: screenshotInfo.browserType,
    filePath: data.filePath,
    storyId: data.storyId,
    title: screenshotInfo.title,
  });

  if (fs.existsSync(paths.filePath)) {
    fs.unlinkSync(paths.filePath);
  }

  story.screenshots = story.screenshots.filter(
    (x) => x.id !== data.screenshotId,
  );

  if (!story.screenshots.length) {
    delete story.screenshots;
  }

  deleteStoryOptions(
    storyData,
    'browserOptions',
    screenshotInfo.browserOptionsId,
  );
  deleteStoryOptions(
    storyData,
    'screenshotOptions',
    screenshotInfo.screenshotOptionsId,
  );

  await saveStoryFile(fileInfo, storyData);

  return story.screenshots || [];
}
