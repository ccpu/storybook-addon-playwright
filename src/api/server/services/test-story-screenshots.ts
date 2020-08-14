import { ImageDiffResult } from '../../typings';
import { StoryInfo } from '../../../typings';
import { getStoryPlaywrightFileInfo, loadStoryData } from '../utils';
import { testScreenshotService } from './test-screenshot-service';
import { getConfigs } from '../configs';
import { RequestData } from '../../../typings/request';
import { getStoryData } from './utils';

export const testStoryScreenshots = async (
  data: StoryInfo & RequestData,
): Promise<ImageDiffResult[]> => {
  const fileInfo = getStoryPlaywrightFileInfo(data.fileName);
  const storyData = await loadStoryData(fileInfo.path, data.storyId);

  data.requestType = data.requestType || 'story';

  const configs = getConfigs();

  const story = getStoryData(storyData, data.storyId);

  if (!story || !story.screenshots) {
    throw new Error('Unable to find story screenshots');
  }

  const diffs: ImageDiffResult[] = [];

  if (configs.beforeStoryImageDiff && data.requestType === 'story') {
    await configs.beforeStoryImageDiff(data);
  }

  for (let i = 0; i < story.screenshots.length; i++) {
    const screenshot = story.screenshots[i];

    const result = await testScreenshotService({
      fileName: data.fileName,
      requestId: data.requestId,
      requestType: data.requestType,
      screenshotId: screenshot.id,
      storyId: data.storyId,
    });
    diffs.push(result);
  }

  if (configs.afterStoryImageDiff && data.requestType === 'story') {
    await configs.afterStoryImageDiff(diffs, data);
  }

  return diffs;
};
