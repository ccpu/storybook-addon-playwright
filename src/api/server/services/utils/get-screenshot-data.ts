import { ScreenshotInfo } from '../../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../../utils';
import { setStoryScreenshotOptions } from './set-story-screenshot-options';
import { getStoryData } from './get-story-data';

export const getScreenshotData = async (info: ScreenshotInfo) => {
  const fileInfo = getStoryPlaywrightFileInfo(info.fileName);
  const storyData = await loadStoryData(fileInfo.path, info.storyId);

  const story = getStoryData(storyData, info.storyId);

  if (!story || !story.screenshots) {
    return undefined;
  }
  const screenShot = story.screenshots.find((x) => x.hash === info.hash);

  if (screenShot) {
    setStoryScreenshotOptions(storyData, screenShot);
  }

  return screenShot;
};
