import { ImageDiffResult } from '../../typings';
import glob from 'fast-glob';
import { testStoryScreenshots } from './test-story-screenshots';
import { loadStoryData } from '../utils';

export const testAppScreenshots = async (
  host: string,
): Promise<ImageDiffResult[]> => {
  const files = await glob(['**/*.playwright.json', '!node_modules/**']);

  const resultsPromise: Promise<ImageDiffResult[]>[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const playWrightData = await loadStoryData(file, '*');

    Object.keys(playWrightData).forEach((k) => {
      if (
        playWrightData[k].screenshots &&
        playWrightData[k].screenshots.length
      ) {
        const result = testStoryScreenshots(
          {
            fileName: file.replace('.playwright.json', '.tsx'), //testStoryScreenshot expect story file to be able process
            storyId: k,
          },
          host,
        );
        resultsPromise.push(result);
      }
    });
  }

  const data = await Promise.all(resultsPromise);

  const results = [].concat(...data);

  return results.filter((x) => !x.pass);
};
