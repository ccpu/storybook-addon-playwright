import { ImageDiffResult } from '../../../typings';

const testStoryScreenshots = jest.fn();

testStoryScreenshots.mockImplementation(
  (): Promise<ImageDiffResult[]> => {
    return new Promise((resolve) => {
      resolve([{ pass: true, screenshotHash: 'hash' }]);
    });
  },
);

export { testStoryScreenshots };
