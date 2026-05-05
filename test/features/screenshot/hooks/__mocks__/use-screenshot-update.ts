import { createElement } from 'react';
import { useScreenshotUpdate as orgHook } from '../../../../../src/hooks';

const useScreenshotUpdate = vi.fn<typeof orgHook>();

useScreenshotUpdate.mockImplementation(() => ({
  UpdateScreenshotSuccessSnackbar: createElement('div'),
  updateScreenshot: async () => undefined,
  updateScreenshotClearResult: () => undefined,
  updateScreenshotInProgress: false,
}));

export { useScreenshotUpdate };
