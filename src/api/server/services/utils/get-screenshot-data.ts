import { ScreenshotInfo } from '../../../../typings';
import { getStoryFileInfo, loadStoryData } from '../../utils';

export const getScreenshotData = async (info: ScreenshotInfo) => {
  const fileInfo = getStoryFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo);

  if (
    !storyData ||
    !storyData[info.storyId] ||
    !storyData[info.storyId].screenshots
  ) {
    return undefined;
  }

  return storyData[info.storyId].screenshots.find((x) => x.hash === info.hash);
};
