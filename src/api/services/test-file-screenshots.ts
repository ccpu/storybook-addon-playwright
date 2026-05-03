import { testStoryScreenshots } from './test-story-screenshots';
import { getStoryPlaywrightData } from '../server/utils';
import { RequestData } from '../../typings/request';
import pLimit from 'p-limit';
import { getConfigs } from '../server/configs';
import { ImageDiffResult } from '../typings';

export interface TestFileScreenshots extends RequestData {
  filePath: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
  disableEvans?: boolean;
  storyId?: string;
}

export const testFileScreenshots = async (
  options: TestFileScreenshots,
): Promise<ImageDiffResult[]> => {
  const { filePath, onComplete, storyId, requestType } = options;
  const configs = getConfigs();

  const storiesData = await getStoryPlaywrightData(filePath);

  const storyBaseId = (
    storiesData.storyData.length > 0
      ? storiesData.storyData[0].storyId
      : storyId
  ).split('--')[0];

  const limit = pLimit(configs.concurrencyLimit.story);

  if (configs.beforeFileImageDiff) {
    await configs.beforeFileImageDiff({ ...options, storyId: storyBaseId });
  }

  const promisees = storiesData.storyData.reduce((arr, story) => {
    if (requestType === 'story' && storyId && story.storyId !== storyId)
      return arr;

    if (story.data.screenshots && story.data.screenshots.length) {
      arr.push(
        limit(() =>
          testStoryScreenshots({
            filePath,
            requestId: options.requestId,
            requestType: options.requestType
              ? options.requestType
              : storyId
              ? 'story'
              : 'file',
            storyId: story.storyId,
          }),
        ),
      );
    }
    return arr;
  }, []);

  const res = await Promise.all(promisees);
  const results = res.reduce((arr, d) => {
    arr = [...arr, ...d];
    return arr;
  }, []);

  if (configs.afterFileImageDiff) {
    await configs.afterFileImageDiff(results, {
      ...options,
      storyId: storyBaseId,
    });
  }

  if (onComplete) onComplete(results);

  return results;
};
