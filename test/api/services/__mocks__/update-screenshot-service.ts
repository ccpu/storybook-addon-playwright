import { ImageDiffResult, UpdateScreenshot } from '../../../../src/api/typings';

import { updateScreenshotService as orgUpdateScreenshotService } from '../../../../src/api/services/update-screenshot-service';

const updateScreenshotService = vi.fn<typeof orgUpdateScreenshotService>();

updateScreenshotService.mockImplementation(
  (data: UpdateScreenshot): Promise<ImageDiffResult> => {
    return new Promise((resolve) => {
      resolve({
        newScreenshot: data.base64,
        pass: true,
        screenshotId: data.screenshotId,
      });
    });
  },
);

export { updateScreenshotService };
