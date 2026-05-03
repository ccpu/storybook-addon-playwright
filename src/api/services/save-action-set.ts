import { SaveActionSetRequest } from '../typings/save-action-set';
import { saveStoryFile } from '../server/utils';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../server/utils';
import { getStoryData } from './utils';

export const saveActionSet = async (
  data: SaveActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const story = getStoryData(storyData, data.storyId, true);

  if (!story.actionSets) {
    story.actionSets = [];
  }

  story.actionSets = story.actionSets.filter((x) => x.id !== data.actionSet.id);

  data.actionSet.actions.forEach((action) => {
    delete action.id;
  });

  story.actionSets.push(data.actionSet);

  await saveStoryFile(fileInfo, storyData);
};
