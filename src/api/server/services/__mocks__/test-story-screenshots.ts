import { ImageDiffResult } from '../../../typings';

const testStoryScreenshots = vi.fn();

testStoryScreenshots.mockImplementation((): Promise<ImageDiffResult[]> => {
  return new Promise((resolve) => {
    resolve([{ pass: true, screenshotId: 'screenshot-id' }]);
  });
});

export { testStoryScreenshots };
