export const useSaveScreenshot = jest.fn().mockImplementation(() => ({
  ErrorSnackbar: () => null,
  getUpdatingScreenshotTitle: jest.fn(),
  inProgress: false,
  onSuccessClose: jest.fn(),
  result: undefined,
  saveScreenShot: jest.fn(),
}));
