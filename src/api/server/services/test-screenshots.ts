import { ImageDiffResult } from '../../typings';
import { testStoryScreenshots } from './test-story-screenshots';
import { getStoryPlaywrightData } from '../utils';

interface TestScreenshotsOptions {
  fileName: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
}

export const testScreenshots = async (
  options: TestScreenshotsOptions,
): Promise<ImageDiffResult[]> => {
  const { fileName, onComplete } = options;

  let results: ImageDiffResult[] = [];

  const storiesData = await getStoryPlaywrightData(fileName);

  for (let i = 0; i < storiesData.length; i++) {
    const story = storiesData[i];
    if (story.data.screenshots && story.data.screenshots.length) {
      const result = await testStoryScreenshots({
        fileName: fileName,
        storyId: story.storyId,
      });
      results = [...results, ...result];
    }
  }

  if (onComplete) onComplete(results);

  return results;
};
