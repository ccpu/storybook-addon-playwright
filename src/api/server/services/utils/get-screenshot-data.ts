import { ScreenshotInfo } from '../../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../../utils';

export const getScreenshotData = async (info: ScreenshotInfo) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  if (
    !storyData ||
    !storyData[info.storyId] ||
    !storyData[info.storyId].screenshots
  ) {
    return undefined;
  }

  return storyData[info.storyId].screenshots.find((x) => x.hash === info.hash);
};
