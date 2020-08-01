import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { StoryInfo } from '../../../typings';
import { setStoryScreenshotOptions } from './utils/set-story-screenshot-options';
import { getStoryData } from './utils';

export const getStoryScreenshots = async (info: StoryInfo) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId);

  if (!story || !story.screenshots || !story.screenshots.length)
    return undefined;

  return story.screenshots.map((screenshot) => {
    setStoryScreenshotOptions(storyData, screenshot);
    return screenshot;
  });
};
