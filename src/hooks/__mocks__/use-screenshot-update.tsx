import { useScreenshotUpdate as UseScreenshotUpdate } from '../use-screenshot-update';

const {
  UpdateScreenshotErrorSnackbar,
  UpdateScreenshotSuccessSnackbar,
} = UseScreenshotUpdate();

const useScreenshotUpdate = jest.fn();

useScreenshotUpdate.mockImplementation(() => ({
  UpdateScreenshotErrorSnackbar,
  UpdateScreenshotSuccessSnackbar,
  updateScreenshot: jest.fn(),
  updateScreenshotClearResult: jest.fn(),
  updateScreenshotInProgress: false,
}));

export { useScreenshotUpdate };
