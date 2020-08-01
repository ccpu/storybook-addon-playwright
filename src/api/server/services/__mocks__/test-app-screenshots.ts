import { ImageDiffResult } from '../../../typings';

const testAppScreenshots = jest.fn();

testAppScreenshots.mockImplementation(
  (): Promise<ImageDiffResult[]> => {
    return new Promise((resolve) => {
      resolve([{ pass: true, screenshotId: 'screenshot-id' }]);
    });
  },
);

export { testAppScreenshots };
