import { loadStoryData, getStoryFileInfo } from '../utils';
import { ActionSet, StoryInfo } from '../../../typings';

export const getActionSet = async (data: StoryInfo): Promise<ActionSet[]> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  return storyData.actionSets;
};
