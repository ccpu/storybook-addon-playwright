import { ImageDiffResult } from '../../typings';
import { testStoryScreenshots } from './test-story-screenshots';
import { getStoryPlaywrightData } from '../utils';
import { RequestData } from '../../../typings/request';

interface TestScreenshotsOptions extends RequestData {
  fileName: string;
  onComplete?: (results: ImageDiffResult[]) => Promise<void>;
  disableEvans?: boolean;
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
      const result = await testStoryScreenshots(
        {
          fileName: fileName,
          requestId: options.requestId,
          storyId: story.storyId,
        },
        options.disableEvans,
      );
      results = [...results, ...result];
    }
  }

  if (onComplete) onComplete(results);

  return results;
};
