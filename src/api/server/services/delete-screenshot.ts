import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../utils';
import { ScreenshotInfo } from '../../../typings';
import { getScreenshotPaths } from './utils';
import * as fs from 'fs';

export const deleteScreenshot = async (data: ScreenshotInfo): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path);

  const screenshotInfo = storyData[data.storyId].screenshots.find(
    (x) => x.hash === data.hash,
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

  storyData[data.storyId].screenshots = storyData[
    data.storyId
  ].screenshots.filter((x) => x.hash !== data.hash);

  if (!storyData[data.storyId].screenshots.length) {
    delete storyData[data.storyId].screenshots;
  }

  await saveStoryFile(fileInfo, storyData);
};
