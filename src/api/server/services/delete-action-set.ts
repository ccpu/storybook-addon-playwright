import {
  loadStoryData,
  getStoryPlaywrightFileInfo,
  saveStoryFile,
} from '../utils';
import { DeleteActionSetRequest } from '../../typings';

export const deleteActionSet = async (
  data: DeleteActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path);

  if (!data.actionSetId) {
    throw new Error('Action set id has not been provided!');
  }

  if (!storyData[data.storyId] || !storyData[data.storyId].actionSets) return;

  storyData[data.storyId].actionSets = storyData[
    data.storyId
  ].actionSets.filter((x) => x.id !== data.actionSetId);

  if (storyData[data.storyId].actionSets.length === 0) {
    delete storyData[data.storyId].actionSets;
  }

  if (Object.keys(storyData[data.storyId]).length === 0) {
    delete storyData[data.storyId];
  }

  await saveStoryFile(fileInfo, storyData);
};
