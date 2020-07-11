import { ImageDiffResult } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testScreenshots } from './test-screenshots';
import { getConfigs } from '../configs';

export const testAppScreenshots = async (): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  const configs = getConfigs();

  let results: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testScreenshots({ fileName: file });
    results = [...results, ...result];
  }

  if (configs.afterAppImageDiff) {
    await configs.afterAppImageDiff(results);
  }

  return results.filter((x) => !x.pass);
};
