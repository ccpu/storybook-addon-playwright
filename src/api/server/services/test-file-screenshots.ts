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
}

export const testFileScreenshots = async (
  options: TestScreenshotsOptions,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete } = options;
  const configs = getConfigs();

  const storiesData = await getStoryPlaywrightData(fileName);

  const limit = pLimit(configs.concurrencyLimit.story);

  const promisees = storiesData.storyData.reduce((arr, story, i) => {
    if (story.data.screenshots && story.data.screenshots.length) {
      arr.push(
        limit(
          (index) =>
            testStoryScreenshots({
              fileName: fileName,
              requestId: options.requestId + '__' + index,
              requestType: options.requestType,
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
