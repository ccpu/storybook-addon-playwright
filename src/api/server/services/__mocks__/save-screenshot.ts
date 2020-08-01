import { ImageDiffResult, SaveScreenshotRequest } from '../../../typings';

const saveScreenshot = jest.fn();
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
