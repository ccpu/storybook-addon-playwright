import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';
import { ActionSet, StoryInfo } from '../../../typings';
import { getStoryData } from './utils';

export const getActionSet = async (data: StoryInfo): Promise<ActionSet[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId);

  if (!story) return undefined;

  return story.actionSets ? story.actionSets : [];
};
