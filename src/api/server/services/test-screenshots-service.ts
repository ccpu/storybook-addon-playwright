import { ImageDiffResult, TestScreenShots } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testFileScreenshots } from './test-file-screenshots';
import { getConfigs } from '../configs';
import pLimit from 'p-limit';
import { isStoryJsonFile } from '../../../utils/is-story-json-file';

export const testScreenshots = async (
  data: TestScreenShots,
): Promise<ImageDiffResult[]> => {
  const { requestType } = data;

  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  const limit = pLimit(configs.concurrencyLimit.file);

  if (configs.beforeAllImageDiff) {
    await configs.beforeAllImageDiff(data);
  }

  const promises = files.reduce((arr, file) => {
    if (
      requestType !== 'all' &&
      data.fileName &&
      !isStoryJsonFile(file, data.fileName)
    ) {
      return arr;
    }

    arr.push(
      limit(() => {
        return testFileScreenshots({
          disableEvans: true,
          fileName: file,
          requestId: data.requestId,
          requestType,
          storyId: data.storyId,
        });
      }),
    );

    return arr;
  }, []);

  const res = await Promise.all(promises);

  const results = res.reduce((arr, d) => {
    arr = [...arr, ...d];
    return arr;
  }, []) as ImageDiffResult[];

  if (configs.afterAllImageDiff) {
    await configs.afterAllImageDiff(results, data);
  }

  return results;
};
