import type { ChangeActionSetIndexInput } from '../../schema';

import arrayMove from 'array-move';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { getStoryData } from './utils';

export async function changeActionSetIndex(info: ChangeActionSetIndexInput) {
  const fileInfo = getStoryPlaywrightFileInfo(info.filePath);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId, false);

  if (!story || !story.actionSets) return;

  story.actionSets = arrayMove(story.actionSets, info.oldIndex, info.newIndex);

  await saveStoryFile(fileInfo, storyData);
}
