import { StoryScreenshotInfo } from '../../typings';
import { getStoryFileInfo, loadStoryData } from '../utils';

export const getStoryScreenshots = async (info: StoryScreenshotInfo) => {
  const fileInfo = getStoryFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo);
  return storyData[info.storyId] && storyData[info.storyId].screenshots;
};
