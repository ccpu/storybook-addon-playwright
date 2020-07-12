import { ImageDiffResult } from '../../typings';
import { StoryInfo } from '../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { testScreenshotService } from './test-screenshot-service';
import { getConfigs } from '../configs';
import { RequestData } from '../../../typings/request';

export const testStoryScreenshots = async (
  data: StoryInfo & RequestData,
  disableEvent = false,
): Promise<ImageDiffResult[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  const configs = getConfigs();

  if (!storyData[data.storyId] || !storyData[data.storyId].screenshots) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  if (configs.beforeStoryImageDiff && !disableEvent) {
    await configs.beforeStoryImageDiff(data);
  }

  for (let i = 0; i < storyData[data.storyId].screenshots.length; i++) {
    const screenshot = storyData[data.storyId].screenshots[i];
    const result = await testScreenshotService({
      fileName: data.fileName,
      hash: screenshot.hash,
      requestId: data.requestId,
      storyId: data.storyId,
    });
    diffs.push(result);
  }

  if (configs.afterStoryImageDiff && !disableEvent) {
    await configs.afterStoryImageDiff(diffs);
  }

  return diffs;
};
