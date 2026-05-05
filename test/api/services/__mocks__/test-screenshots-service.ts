import { ImageDiffResult } from '../../../../src/api/typings';

import { testScreenshots as orgTestScreenshots } from '../../../../src/api/services/test-screenshots-service';

const testScreenshots = vi.fn<typeof orgTestScreenshots>();

testScreenshots.mockImplementation((): Promise<ImageDiffResult[]> => {
  return new Promise((resolve) => {
    resolve([{ pass: true, screenshotId: 'screenshot-id' }]);
  });
});

export { testScreenshots };
