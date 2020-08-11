import { ImageDiffResult } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testScreenshots } from './test-screenshots';
import { getConfigs } from '../configs';
import { RequestData } from '../../../typings/request';
import pLimit from 'p-limit';

export const testAppScreenshots = async (
  data: RequestData,
): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  const limit = pLimit(configs.fileConcurrencyLimit);

  if (configs.beforeAppImageDiff) {
    await configs.beforeAppImageDiff(data);
  }

  const promises = files.reduce((arr, file, i) => {
    arr.push(
      limit((index) => {
        return testScreenshots({
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

  const results = res.map((d) => d[0]);

  if (configs.afterAppImageDiff) {
    await configs.afterAppImageDiff(results, data);
  }

  return results.filter((x) => x && !x.pass);
};
