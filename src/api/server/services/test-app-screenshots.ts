import { ImageDiffResult, AppScreenshotTest } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testFileScreenshots } from './test-file-screenshots';
import { getConfigs } from '../configs';
import pLimit from 'p-limit';
import { isStoryJsonFile } from '../../../utils/is-story-json-file';

export const testAppScreenshots = async (
  data: AppScreenshotTest,
): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  const limit = pLimit(configs.concurrencyLimit.file);

  if (configs.beforeAppImageDiff) {
    await configs.beforeAppImageDiff(data);
  }

  const promises = files.reduce((arr, file, i) => {
    if (data.fileName && !isStoryJsonFile(file, data.fileName)) {
      return arr;
    }

    arr.push(
      limit((index) => {
        return testFileScreenshots({
          disableEvans: true,
          fileName: file,
          requestId: data.requestId + '__' + index,
          requestType: 'app',
        });
      }, i),
    );

    return arr;
  }, []);

  const res = await Promise.all(promises);

  const results = res.reduce((arr, d) => {
    arr = [...arr, ...d];
    return arr;
  }, []);

  if (configs.afterAppImageDiff) {
    await configs.afterAppImageDiff(results, data);
  }

  return results.filter((x) => x && !x.pass);
};
