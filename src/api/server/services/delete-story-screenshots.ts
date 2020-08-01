import { StoryInfo } from '../../../typings';
import { getStoryScreenshots } from './get-story-screenshots';
import { deleteScreenshot } from './delete-screenshot';

export const deleteStoryScreenshots = async (
  storyInfo: StoryInfo,
): Promise<void> => {
  const screenshots = await getStoryScreenshots(storyInfo);

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    await deleteScreenshot({
      fileName: storyInfo.fileName,
      screenshotId: screenshot.id,
      storyId: storyInfo.storyId,
    });
  }
};
