import { ImageDiffResult, UpdateScreenshot } from '../../../typings';

const updateScreenshotService = jest.fn();

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
