import { ImageDiffResult } from '../../typings';
import { testStoryScreenshots } from './test-story-screenshots';
import { getStoryPlaywrightData } from '../utils';
import { RequestData } from '../../../typings/request';
import pLimit from 'p-limit';
import { getConfigs } from '../configs';

export interface TestFileScreenshots extends RequestData {
  fileName: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
  disableEvans?: boolean;
  storyId?: string;
}

export const testFileScreenshots = async (
  options: TestFileScreenshots,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete, storyId, requestType } = options;
  const configs = getConfigs();

  const storiesData = await getStoryPlaywrightData(fileName);

  const limit = pLimit(configs.concurrencyLimit.story);

  if (configs.beforeFileImageDiff) {
    configs.beforeFileImageDiff(options);
  }

  const promisees = storiesData.storyData.reduce((arr, story, i) => {
    if (requestType === 'story' && storyId && story.storyId !== storyId)
      return arr;

    if (story.data.screenshots && story.data.screenshots.length) {
      arr.push(
        limit(
          (index) =>
            testStoryScreenshots({
              fileName: fileName,
              requestId: options.requestId + '__' + index,
              requestType: options.requestType
                ? options.requestType
                : storyId
                ? 'story'
                : 'file',
              storyId: story.storyId,
            }),
          i,
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
    configs.afterFileImageDiff(results, options);
  }

  if (onComplete) onComplete(results);

  return results;
};
