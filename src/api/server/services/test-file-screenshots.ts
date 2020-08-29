import { ImageDiffResult } from '../../typings';
import { testStoryScreenshots } from './test-story-screenshots';
import { getStoryPlaywrightData } from '../utils';
import { RequestData } from '../../../typings/request';
import pLimit from 'p-limit';
import { getConfigs } from '../configs';

interface TestScreenshotsOptions extends RequestData {
  fileName: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
  disableEvans?: boolean;
  storyId?: string;
}

export const testFileScreenshots = async (
  options: TestScreenshotsOptions,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete, storyId } = options;
  const configs = getConfigs();

  const storiesData = await getStoryPlaywrightData(fileName);

  const limit = pLimit(configs.concurrencyLimit.story);

  const promisees = storiesData.storyData.reduce((arr, story, i) => {
    if (storyId && story.storyId !== storyId) return arr;
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

  if (onComplete) onComplete(results);

  return results;
};
