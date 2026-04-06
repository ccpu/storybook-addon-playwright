import * as fs from 'fs';

import { deleteStoryOptions, getStoryData } from './utils';
import { ScreenshotData, ScreenshotInfo } from '../../typings';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { getScreenshotPaths } from '../server/utils/get-screenshot-paths';

export const deleteScreenshot = async (
  data: ScreenshotInfo,
): Promise<ScreenshotData[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId, false);

  const story = getStoryData(storyData, data.storyId);

  if (!story) return undefined;

  const screenshotInfo = story.screenshots.find(
    (x) => x.id === data.screenshotId,
  );

  const paths = getScreenshotPaths({
    browserType: screenshotInfo.browserType,
    fileName: data.fileName,
    storyId: data.storyId,
    title: screenshotInfo.title,
  });

  if (fs.existsSync(paths.fileName)) {
    fs.unlinkSync(paths.fileName);
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

  return story.screenshots;
};
