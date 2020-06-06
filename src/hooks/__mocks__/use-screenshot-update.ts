import { createElement } from 'react';

const useScreenshotUpdate = jest.fn();

useScreenshotUpdate.mockImplementation(() => ({
  UpdateScreenshotErrorSnackbar: createElement('div'),
  UpdateScreenshotSuccessSnackbar: createElement('div'),
  updateScreenshot: () => undefined,
  updateScreenshotClearResult: () => undefined,
  updateScreenshotInProgress: false,
}));

export { useScreenshotUpdate };
