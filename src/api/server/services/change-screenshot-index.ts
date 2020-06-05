import arrayMove from 'array-move';
import { ChangeScreenshotIndex } from '../../typings';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../utils';

export const changeScreenShotIndex = async (info: ChangeScreenshotIndex) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  if (!storyData[info.storyId] || !storyData[info.storyId].screenshots) return;

  const screenshots = arrayMove(
    storyData[info.storyId].screenshots,
    info.oldIndex,
    info.newIndex,
  );

  storyData[info.storyId].screenshots = screenshots.map((screenshot, index) => {
    screenshot.index = index;
    return screenshot;
  });

  await saveStoryFile(fileInfo, storyData);
};
