import {
  loadStoryData,
  getStoryPlaywrightFileInfo,
  saveStoryFile,
} from '../utils';
import { DeleteActionSetRequest } from '../../typings';
import { getStoryData, deleteEmptyStory } from './utils';

export const deleteActionSet = async (
  data: DeleteActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  let storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!data.actionSetId) {
    throw new Error('Action set id has not been provided!');
  }

  const story = getStoryData(storyData, data.storyId);

  if (!story || !story.actionSets) return;

  story.actionSets = story.actionSets.filter((x) => x.id !== data.actionSetId);

  if (story.actionSets.length === 0) {
    delete story.actionSets;
  }

  storyData = deleteEmptyStory(storyData, data.storyId);

  await saveStoryFile(fileInfo, storyData);
};
