import type { DeleteActionSetInput } from '../../schema';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { deleteEmptyStory, getStoryData } from './utils';

export async function deleteActionSet(
  data: DeleteActionSetInput,
): Promise<void> {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  let storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!storyData) {
    return;
  }

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
}
