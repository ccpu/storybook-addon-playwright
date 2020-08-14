import { StoryInfo } from '../../../typings';
import { getStoryScreenshotsData } from './get-story-screenshots-data';
import { deleteScreenshot } from './delete-screenshot';

export const deleteStoryScreenshots = async (
  storyInfo: StoryInfo,
): Promise<void> => {
  const screenshots = await getStoryScreenshotsData(storyInfo);

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    await deleteScreenshot({
      fileName: storyInfo.fileName,
      screenshotId: screenshot.id,
      storyId: storyInfo.storyId,
    });
  }
};
