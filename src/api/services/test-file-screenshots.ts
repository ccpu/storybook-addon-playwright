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
    storiesData.storyData[0]?.storyId ??
    storyId ??
    ''
  ).split('--')[0];

  const limit = pLimit(configs.concurrencyLimit?.story ?? 1);

  if (configs.beforeFileImageDiff) {
    await configs.beforeFileImageDiff({ ...options, storyId: storyBaseId });
  }

  const promisees = storiesData.storyData.reduce<
    Array<Promise<ImageDiffResult[]>>
  >((arr, story) => {
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
  const results = res.reduce<ImageDiffResult[]>((arr, d) => {
    const normalized = d.map((diff) => {
      if (diff.added && diff.pass === false) {
        const rest = { ...diff } as ImageDiffResult;
        delete (rest as { pass?: boolean }).pass;
        return rest;
      }

      return diff;
    });

    return [...arr, ...normalized];
  }, []);

  if (configs.afterFileImageDiff) {
    await configs.afterFileImageDiff(results, {
      ...options,
      storyId: storyBaseId,
    });
  }

  if (onComplete) await onComplete(results);

  return results;
};
