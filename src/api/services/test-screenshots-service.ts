import { ImageDiffResult } from '../typings/image-diff';
import { getPlaywrightConfigFiles } from '../../utils/get-playwright-config-files';
import { testFileScreenshots } from './test-file-screenshots';
import { getConfigs } from '../server/configs';
import pLimit from 'p-limit';
import { isStoryJsonFile } from '../../utils/is-story-json-file';
import { TestScreenshotsInput } from '../../schema';

export const testScreenshots = async (
  data: TestScreenshotsInput,
): Promise<ImageDiffResult[]> => {
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

  const promises = files.reduce<Array<Promise<ImageDiffResult[]>>>(
    (arr, file) => {
      if (
        requestType !== 'all' &&
        data.filePath &&
        !isStoryJsonFile(file, data.filePath)
      ) {
        return arr;
      }

      arr.push(
        limit(() => {
          return testFileScreenshots({
            disableEvans: true,
            filePath: file,
            requestId: data.requestId ?? '',
            requestType,
            storyId: data.storyId,
          });
        }),
      );

      return arr;
    },
    [],
  );

  const res = await Promise.all(promises);

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

  if (configs.afterAllImageDiff) {
    await configs.afterAllImageDiff(results, requestData);
  }

  return results;
};
