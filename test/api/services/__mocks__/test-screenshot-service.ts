import { ImageDiffResult } from '../../../../src/api/typings';
import { ScreenshotInfo } from '../../../../src/typings';

import { testScreenshotService as orgTestScreenshotService } from '../../../../src/api/services/test-screenshot-service';

const testScreenshotService = vi.fn<typeof orgTestScreenshotService>();
testScreenshotService.mockImplementation(
  (data: ScreenshotInfo): Promise<ImageDiffResult> => {
    return new Promise((resolve) => {
      resolve({ pass: true, screenshotId: data.screenshotId });
    });
  },
);

export { testScreenshotService };
