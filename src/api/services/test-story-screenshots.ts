import type { TestStoryScreenshotsInput } from '../../schema';

import type { ImageDiffResult } from '../typings/image-diff';
import { getConfigs } from '../server/configs';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../server/utils';
import { testScreenshotService } from './test-screenshot-service';
import { getStoryData } from './utils';

export async function testStoryScreenshots(
  data: TestStoryScreenshotsInput,
): Promise<ImageDiffResult[]> {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  data.requestType = data.requestType || 'story';
  const requestData = {
    ...data,
    requestId: data.requestId || '',
  };

  const configs = getConfigs();

  const story = getStoryData(storyData, data.storyId);

  if (!story || !story.screenshots) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  if (configs.beforeStoryImageDiff) {
    await configs.beforeStoryImageDiff(requestData);
  }

  for (let i = 0; i < story.screenshots.length; i++) {
    const screenshot = story.screenshots[i];

    const result = await testScreenshotService({
      filePath: data.filePath,
      requestId: requestData.requestId,
      requestType: data.requestType,
      screenshotId: screenshot.id,
      storyId: data.storyId,
    });
    diffs.push(result);
  }

  if (configs.afterStoryImageDiff) {
    await configs.afterStoryImageDiff(diffs, requestData);
  }

  return diffs;
}
