import { saveStoryFile } from '../server/utils';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../server/utils';
import { getStoryData } from './utils';
import { SaveActionSetInput } from '../../schema';
import { StoryAction } from '../../typings';

export const saveActionSet = async (
  data: SaveActionSetInput,
): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId, true);

  if (!story) return;

  if (!story.actionSets) {
    story.actionSets = [];
  }

  story.actionSets = story.actionSets.filter((x) => x.id !== data.actionSet.id);

  const actionSetToSave = {
    ...data.actionSet,
    actions: data.actionSet.actions.map((action) => {
      const { id: _id, ...actionWithoutId } = action as StoryAction;
      return actionWithoutId as StoryAction;
    }),
  };

  story.actionSets.push(actionSetToSave);

  await saveStoryFile(fileInfo, storyData);
};
