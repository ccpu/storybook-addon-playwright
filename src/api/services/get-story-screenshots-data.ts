import { getStoryPlaywrightFileInfo, loadStoryData } from '../server/utils';

import { setStoryScreenshotOptions } from './utils/set-story-screenshot-options';
import { getStoryData } from './utils';
import { StoryInfo } from '../../schema';

export const getStoryScreenshotsData = async (info: StoryInfo) => {
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
};
