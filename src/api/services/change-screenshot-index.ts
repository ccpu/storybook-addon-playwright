import arrayMove from 'array-move';

import { getStoryData } from './utils';
import { ChangeScreenshotIndexInput } from '../../schema';
import { ScreenshotData } from '../../typings';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';

export const changeScreenshotIndex = async (
  info: ChangeScreenshotIndexInput,
) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.filePath);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId, false);

  if (!story || !story.screenshots) return;

  const screenshots = arrayMove(
    story.screenshots,
    info.oldIndex,
    info.newIndex,
  );

  story.screenshots = screenshots.map((screenshot, index) => {
    (screenshot as ScreenshotData).index = index;
    return screenshot;
  });

  await saveStoryFile(fileInfo, storyData);
};
