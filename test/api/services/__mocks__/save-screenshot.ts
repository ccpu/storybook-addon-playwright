import { ImageDiffResult, SaveScreenshotRequest } from '../../../../src/api/typings';

import { saveScreenshot as orgSaveScreenshot } from '../../../../src/api/services/save-screenshot';

const saveScreenshot = vi.fn<typeof orgSaveScreenshot>();
saveScreenshot.mockImplementation(
  (data: SaveScreenshotRequest): Promise<ImageDiffResult> => {
    return new Promise((resolve) => {
      resolve({
        pass: true,
        screenshotId: data.id,
      });
    });
  },
);
export { saveScreenshot };
