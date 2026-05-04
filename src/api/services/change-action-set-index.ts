import arrayMove from 'array-move';

import { getStoryData } from './utils';
import { ChangeActionSetIndexInput } from '../../schema';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';

export const changeActionSetIndex = async (info: ChangeActionSetIndexInput) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.filePath);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId, false);

  if (!story || !story.actionSets) return;

  story.actionSets = arrayMove(story.actionSets, info.oldIndex, info.newIndex);

  await saveStoryFile(fileInfo, storyData);
};
