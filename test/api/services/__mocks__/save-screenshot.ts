import {
  ImageDiffResult,
  SaveScreenshotRequest,
} from '../../../../src/api/typings';

const saveScreenshot = vi.fn();
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
