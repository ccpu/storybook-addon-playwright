import type { TestScreenshotsInput } from '../../schema';
import type { ImageDiffResult } from '../typings/image-diff';
import pLimit from 'p-limit';
import { getPlaywrightConfigFiles } from '../../utils/get-playwright-config-files';
import { isStoryJsonFile } from '../../utils/is-story-json-file';
import { getConfigs } from '../server/configs';
import { testFileScreenshots } from './test-file-screenshots';

export async function testScreenshots(
  data: TestScreenshotsInput,
): Promise<ImageDiffResult[]> {
  const requestData = {
    ...data,
    requestId: data.requestId || '',
  };
  const { requestType } = data;

  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  const limit = pLimit(configs.concurrencyLimit?.file ?? 1);

  if (configs.beforeAllImageDiff) {
    await configs.beforeAllImageDiff(requestData);
  }

  const promises = files.reduce<Array<Promise<ImageDiffResult[]>>>((arr, file) => {
    if (requestType !== 'all' && data.filePath && !isStoryJsonFile(file, data.filePath)) {
      return arr;
    }

    arr.push(
      limit(async () =>
        testFileScreenshots({
          disableEvans: true,
          filePath: file,
          requestId: data.requestId ?? '',
          requestType,
          storyId: data.storyId,
        }),
      ),
    );

    return arr;
  }, []);

  const res = await Promise.all(promises);

  const results = res.reduce<ImageDiffResult[]>((arr, d) => {
    const normalized = d.map((diff) => {
      if (diff.added && diff.pass === false) {
        const rest = { ...diff };
        delete (rest as { pass?: boolean }).pass;
        return rest;
      }

      return diff;
    });

    return [...arr, ...normalized];
  }, []);

  if (configs.afterAllImageDiff) {
    await configs.afterAllImageDiff(results, requestData);
  }

  return results;
}
