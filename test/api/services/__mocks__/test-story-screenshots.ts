import { ImageDiffResult } from '../../../../src/api/typings';

import { testStoryScreenshots as orgTestStoryScreenshots } from '../../../../src/api/services/test-story-screenshots';

const testStoryScreenshots = vi.fn<typeof orgTestStoryScreenshots>();

testStoryScreenshots.mockImplementation((): Promise<ImageDiffResult[]> => {
  return new Promise((resolve) => {
    resolve([{ pass: true, screenshotId: 'screenshot-id' }]);
  });
});

export { testStoryScreenshots };
