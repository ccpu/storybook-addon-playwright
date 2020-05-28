import { ImageDiffResult } from '../../typings';
import { StoryInfo } from '../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { testScreenshot } from './test-screenShot';

export const testStoryScreenshot = async (
  data: StoryInfo,
  host: string,
): Promise<ImageDiffResult[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path);

  if (
    !storyData ||
    !storyData[data.storyId] ||
    !storyData[data.storyId].screenshots
  ) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  for (let i = 0; i < storyData[data.storyId].screenshots.length; i++) {
    const screenshot = storyData[data.storyId].screenshots[i];
    const result = await testScreenshot(
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
