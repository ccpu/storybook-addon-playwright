import type { StoryInfo } from '../../schema';
import { deleteScreenshot } from './delete-screenshot';
import { getStoryScreenshotsData } from './get-story-screenshots-data';

export async function deleteStoryScreenshots(
  storyInfo: StoryInfo,
): Promise<void> {
  const screenshots = await getStoryScreenshotsData(storyInfo);

  if (!screenshots || !screenshots.length) {
    return;
  }

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    if (!screenshot) continue;

    await deleteScreenshot({
      filePath: storyInfo.filePath,
      screenshotId: screenshot.id,
      storyId: storyInfo.storyId,
    });
  }
}
