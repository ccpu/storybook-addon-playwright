import { loadStoryData, getStoryPlaywrightFileInfo } from '../server/utils';
import { ActionSet } from '../../typings';
import { getStoryData } from './utils';
import { nanoid } from 'nanoid';
import { StoryInfo } from '../../schema';

export const getActionSet = async (data: StoryInfo): Promise<ActionSet[]> => {
  console.log('Fetching action set for story:', data.storyId);
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId);

  if (!story) return undefined;

  return story.actionSets
    ? story.actionSets.map((actionSet) => {
        actionSet.actions.forEach((action) => {
          action.id = nanoid();
        });
        return actionSet;
      })
    : [];
};
