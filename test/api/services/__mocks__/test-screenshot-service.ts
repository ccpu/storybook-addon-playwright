import { ImageDiffResult } from '../../../../src/api/typings';
import { ScreenshotInfo } from '../../../../src/typings';

const testScreenshotService = vi.fn();
testScreenshotService.mockImplementation(
  (data: ScreenshotInfo): Promise<ImageDiffResult> => {
    return new Promise((resolve) => {
      resolve({ pass: true, screenshotId: data.screenshotId });
    });
  },
);

export { testScreenshotService };
