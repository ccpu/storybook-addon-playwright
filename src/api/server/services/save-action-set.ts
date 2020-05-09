import { SaveActionSetRequest } from '../../typings';
import { saveStoryFile } from '../utils';
import { loadStoryData, getStoryFileInfo } from '../utils';

export const saveActionSet = async (
  data: SaveActionSetRequest,
): Promise<void> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  if (!storyData.actionSets) {
    storyData.actionSets = [];
  }

  storyData.actionSets = storyData.actionSets.filter(
    (x) => x.storyId !== data.storyId,
  );

  storyData.actionSets.push(data.actionSet);

  await saveStoryFile(fileInfo, storyData);
};
