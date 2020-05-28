import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { StoryInfo } from '../../../typings';

export const getStoryScreenshots = async (info: StoryInfo) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo.path);
  return storyData[info.storyId] && storyData[info.storyId].screenshots;
};
