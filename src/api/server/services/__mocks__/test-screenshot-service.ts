import { ImageDiffResult } from '../../../typings';
import { ScreenshotInfo } from '../../../../typings';

const testScreenshotService = jest.fn();
testScreenshotService.mockImplementation(
  (data: ScreenshotInfo): Promise<ImageDiffResult> => {
    return new Promise((resolve) => {
      resolve({ pass: true, screenshotId: data.screenshotId });
    });
  },
);

export { testScreenshotService };
