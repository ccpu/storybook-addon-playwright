import { ImageDiffResult } from '../../typings';
import { StoryInfo } from '../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { testScreenshotService } from './test-screenshot-service';

export const testStoryScreenshots = async (
  data: StoryInfo,
  host: string,
): Promise<ImageDiffResult[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  if (!storyData[data.storyId] || !storyData[data.storyId].screenshots) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  for (let i = 0; i < storyData[data.storyId].screenshots.length; i++) {
    const screenshot = storyData[data.storyId].screenshots[i];
    const result = await testScreenshotService(
      {
        fileName: data.fileName,
        hash: screenshot.hash,
        storyId: data.storyId,
      },
      host,
    );
    diffs.push(result);
  }

  return diffs;
};
