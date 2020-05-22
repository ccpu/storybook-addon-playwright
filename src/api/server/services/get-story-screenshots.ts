import { getStoryFileInfo, loadStoryData } from '../utils';
import { StoryInfo } from '../../../typings';

export const getStoryScreenshots = async (info: StoryInfo) => {
  const fileInfo = getStoryFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo);
  return storyData[info.storyId] && storyData[info.storyId].screenshots;
};
