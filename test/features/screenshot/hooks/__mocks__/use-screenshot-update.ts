import { createElement } from 'react';

const useScreenshotUpdate = vi.fn();

useScreenshotUpdate.mockImplementation(() => ({
  UpdateScreenshotSuccessSnackbar: createElement('div'),
  updateScreenshot: () => undefined,
  updateScreenshotClearResult: () => undefined,
  updateScreenshotInProgress: false,
}));

export { useScreenshotUpdate };
