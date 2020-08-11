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

export const testScreenshots = async (
  options: TestScreenshotsOptions,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete } = options;
  const configs = getConfigs();

  const storiesData = await getStoryPlaywrightData(fileName);

  const limit = pLimit(configs.storyConcurrencyLimit);

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

  const data = await Promise.all(promisees);
  const results = data.map((d) => d[0]);

  if (onComplete) onComplete(results);

  return results;
};
