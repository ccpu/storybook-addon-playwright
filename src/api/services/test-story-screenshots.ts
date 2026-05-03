import { ImageDiffResult } from '../typings/image-diff';

import { getStoryPlaywrightFileInfo, loadStoryData } from '../server/utils';
import { testScreenshotService } from './test-screenshot-service';
import { getConfigs } from '../server/configs';
import { RequestData } from '../../typings/request';
import { getStoryData } from './utils';
import { StoryInfo } from '../../schema';

export const testStoryScreenshots = async (
  data: StoryInfo & RequestData,
): Promise<ImageDiffResult[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.filePath);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  data.requestType = data.requestType || 'story';

  const configs = getConfigs();

  const story = getStoryData(storyData, data.storyId);

  if (!story || !story.screenshots) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  if (configs.beforeStoryImageDiff) {
    await configs.beforeStoryImageDiff(data);
  }

  for (let i = 0; i < story.screenshots.length; i++) {
    const screenshot = story.screenshots[i];

    const result = await testScreenshotService({
      fileName: data.fileName,
      filePath: data.filePath,
      requestId: data.requestId,
      requestType: data.requestType,
      screenshotId: screenshot.id,
      storyId: data.storyId,
    });
    diffs.push(result);
  }

  if (configs.afterStoryImageDiff) {
    await configs.afterStoryImageDiff(diffs, data);
  }

  return diffs;
};
