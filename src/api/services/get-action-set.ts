import type { StoryInfo } from '../../schema';
import type { ActionSet } from '../../typings';
import { nanoid } from 'nanoid';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../server/utils';
import { getStoryData } from './utils';

export async function getActionSet(data: StoryInfo): Promise<ActionSet[]> {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId);

  if (!story) return [];

  return story.actionSets
    ? story.actionSets.map((actionSet) => {
        actionSet.actions.forEach((action) => {
          action.id = nanoid();
        });
        return actionSet;
      })
    : [];
}
