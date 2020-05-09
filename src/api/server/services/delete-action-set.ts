import { loadStoryData, getStoryFileInfo, saveStoryFile } from '../utils';
import { ActionSet } from '../../../typings';
import { DeleteActionSetRequest } from '../../typings';

export const deleteActionSet = async (
  data: DeleteActionSetRequest,
): Promise<ActionSet[]> => {
  const fileInfo = getStoryFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo);

  if (!data.actionSetId) {
    throw new Error('Action set id has not been provided!');
  }

  storyData.actionSets = storyData.actionSets.filter(
    (x) => x.id !== data.actionSetId,
  );

  await saveStoryFile(fileInfo, storyData);

  return storyData.actionSets;
};
