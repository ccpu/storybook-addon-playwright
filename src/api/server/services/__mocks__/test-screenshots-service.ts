import { ImageDiffResult } from '../../../typings';

const testScreenshots = jest.fn();

testScreenshots.mockImplementation(
  (): Promise<ImageDiffResult[]> => {
    return new Promise((resolve) => {
      resolve([{ pass: true, screenshotId: 'screenshot-id' }]);
    });
  },
);

export { testScreenshots };
