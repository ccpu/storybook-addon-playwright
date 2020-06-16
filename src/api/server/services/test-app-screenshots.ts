import { ImageDiffResult } from '../../typings';
import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testScreenshots } from './test-screenshots';

export const testAppScreenshots = async (): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  let results: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testScreenshots({ fileName: file });
    results = [...results, ...result];
  }

  return results.filter((x) => !x.pass);
};
