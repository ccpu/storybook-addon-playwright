import type { StoryInfo } from '../../schema';

import { getStoryPlaywrightFileInfo, loadStoryData } from '../server/utils';
import { getStoryData } from './utils';
import { setStoryScreenshotOptions } from './utils/set-story-screenshot-options';

export async function getStoryScreenshotsData(info: StoryInfo) {
  const fileInfo = getStoryPlaywrightFileInfo(info.filePath);

  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId);

  if (!story || !story.screenshots || !story.screenshots.length) {
    return undefined;
  }

  return story.screenshots.map((screenshot) => {
    if (storyData) {
      setStoryScreenshotOptions(storyData, screenshot);
    }
    return screenshot;
  });
}
