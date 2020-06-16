import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';
import { testScreenshots } from './api/server/services/test-screenshots';
import { ImageDiffResult } from './api/typings';

interface RunImageDiffOptions {
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
}

export const runImageDiff = async (
  playwrightConfigPath: string | '*',
  options?: RunImageDiffOptions,
) => {
  const files = await getPlaywrightConfigFiles(playwrightConfigPath);

  let results: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testScreenshots({
      fileName: file,
    });

    results = [...results, ...result];
  }

  if (options && options.onComplete) {
    options.onComplete(results);
  }

  return results;
};
