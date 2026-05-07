import type { ImageDiffResult } from './api/typings';
import type { RequestData } from './typings/request';
import { nanoid } from 'nanoid';
import { testFileScreenshots } from './api/services';
import { getPlaywrightConfigFiles } from './utils/get-playwright-config-files';

interface RunImageDiffOptions extends RequestData {
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
}

export async function runImageDiff(
  playwrightConfigPath: string | '*',
  options?: RunImageDiffOptions,
) {
  const files = await getPlaywrightConfigFiles(playwrightConfigPath);

  let results: ImageDiffResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const result = await testFileScreenshots({
      filePath: file,
      requestId: options && options.requestId ? options.requestId : nanoid(),
    });

    results = [...results, ...result];
  }

  if (options && options.onComplete) {
    options.onComplete(results);
  }

  return results;
}
