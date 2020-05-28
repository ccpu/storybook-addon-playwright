import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';
import { ActionSet, StoryInfo } from '../../../typings';

export const getActionSet = async (data: StoryInfo): Promise<ActionSet[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path);

  return storyData[data.storyId] ? storyData[data.storyId].actionSets : [];
};
