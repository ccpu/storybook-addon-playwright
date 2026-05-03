import { getStoryScreenshotsData } from './get-story-screenshots-data';
import { deleteScreenshot } from './delete-screenshot';
import { StoryInfo } from '../../schema';

export const deleteStoryScreenshots = async (
  storyInfo: StoryInfo,
): Promise<void> => {
  const screenshots = await getStoryScreenshotsData(storyInfo);

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    await deleteScreenshot({
      filePath: storyInfo.filePath,
      screenshotId: screenshot.id,
      storyId: storyInfo.storyId,
    });
  }
};
