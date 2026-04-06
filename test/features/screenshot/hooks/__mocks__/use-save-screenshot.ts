export const useSaveScreenshot = vi.fn().mockImplementation(() => ({
  ErrorSnackbar: () => null,
  getUpdatingScreenshotTitle: vi.fn(),
  inProgress: false,
  onSuccessClose: vi.fn(),
  result: undefined,
  saveScreenShot: vi.fn(),
}));
