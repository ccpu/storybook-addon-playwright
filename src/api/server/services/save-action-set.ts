import { SaveActionSetRequest } from '../../typings';
import { saveStoryFile } from '../utils';
import { loadStoryData, getStoryPlaywrightFileInfo } from '../utils';

export const saveActionSet = async (
  data: SaveActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!storyData[data.storyId].actionSets) {
    storyData[data.storyId].actionSets = [];
  }

  storyData[data.storyId].actionSets = storyData[
    data.storyId
  ].actionSets.filter((x) => x.id !== data.actionSet.id);

  storyData[data.storyId].actionSets.push(data.actionSet);

  await saveStoryFile(fileInfo, storyData);
};
