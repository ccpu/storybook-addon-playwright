import type { ChangeScreenshotIndexInput } from '../../schema';
import arrayMove from 'array-move';
import {
  getStoryPlaywrightFileInfo,
  loadStoryData,
  saveStoryFile,
} from '../server/utils';
import { getStoryData } from './utils';

export async function changeScreenshotIndex(info: ChangeScreenshotIndexInput) {
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
    screenshot.index = index;
    return screenshot;
  });

  await saveStoryFile(fileInfo, storyData);
}
