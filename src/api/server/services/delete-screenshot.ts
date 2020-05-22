import { getStoryFileInfo, loadStoryData, saveStoryFile } from '../utils';
import { ScreenshotInfo } from '../../../typings';
import { getScreenshotPaths } from './utils';
import * as fs from 'fs';

export const deleteScreenshot = async (data: ScreenshotInfo): Promise<void> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  const screenshotInfo = storyData[data.storyId].screenshots.find(
    (x) => x.hash === data.hash,
  );

  const paths = getScreenshotPaths(
    data,
    screenshotInfo.browserType,
    screenshotInfo.description,
  );

  if (fs.existsSync(paths.fileName)) {
    fs.unlinkSync(paths.fileName);
  }

  storyData[data.storyId].screenshots = storyData[
    data.storyId
  ].screenshots.filter((x) => x.hash !== data.hash);

  await saveStoryFile(fileInfo, storyData);
};
