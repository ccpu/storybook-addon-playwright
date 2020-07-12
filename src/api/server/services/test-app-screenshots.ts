import { ImageDiffResult } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testScreenshots } from './test-screenshots';
import { getConfigs } from '../configs';
import { RequestData } from '../../../typings/request';

export const testAppScreenshots = async (
  data: RequestData,
): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  let results: ImageDiffResult[] = [];

  if (configs.beforeAppImageDiff) {
    await configs.beforeAppImageDiff(data);
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testScreenshots({
      disableEvans: true,
      fileName: file,
      requestId: data.requestId,
    });
    results = [...results, ...result];
  }

  if (configs.afterAppImageDiff) {
    await configs.afterAppImageDiff(results);
  }

  return results.filter((x) => !x.pass);
};
