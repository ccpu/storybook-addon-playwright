import { ImageDiffResult } from '../../typings';
import { testStoryScreenshots } from './test-story-screenshots';
import { loadStoryData } from '../utils';

interface TestScreenshotsOptions {
  fileName: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
}

export const testScreenshots = async (
  options: TestScreenshotsOptions,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete } = options;

  const resultsPromise: Promise<ImageDiffResult[]>[] = [];

  const playWrightData = await loadStoryData(fileName, '*');

  Object.keys(playWrightData).forEach((k) => {
    if (playWrightData[k].screenshots && playWrightData[k].screenshots.length) {
      const result = testStoryScreenshots({
        fileName: fileName,
        storyId: k,
      });
      resultsPromise.push(result);
    }
  });

  const data = await Promise.all(resultsPromise);

  const results = [].concat(...data);

  if (onComplete) onComplete(results);

  return results.filter((x) => !x.pass);
};
