import { ImageDiffResult } from '../../typings';

import { getPlaywrightConfigFiles } from '../../../utils/get-playwright-config-files';
import { testScreenshots } from './test-screenshots';

export const testAppScreenshots = async (): Promise<ImageDiffResult[]> => {
  const files = await getPlaywrightConfigFiles();

  let resultsPromise: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testScreenshots({ fileName: file });
    resultsPromise = [...resultsPromise, ...result];
  }

  return resultsPromise.filter((x) => !x.pass);
};
