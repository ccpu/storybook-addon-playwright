import { SaveActionSetRequest } from '../../typings';
import { saveStoryFile } from '../utils';
import { loadStoryData, getStoryFileInfo } from '../utils';

export const saveActionSet = async (
  data: SaveActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  if (!storyData[data.storyId]) {
    storyData[data.storyId] = {};
  }

  if (!storyData[data.storyId].actionSets) {
    storyData[data.storyId].actionSets = [];
  }

  storyData[data.storyId].actionSets = storyData[
    data.storyId
  ].actionSets.filter((x) => x.id !== data.actionSet.id);

  storyData[data.storyId].actionSets.push(data.actionSet);

  await saveStoryFile(fileInfo, storyData);
};
