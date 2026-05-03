export const useSaveScreenshot = vi.fn().mockImplementation(() => ({
  getUpdatingScreenshotTitle: vi.fn(),
  inProgress: false,
  onSuccessClose: vi.fn(),
  result: undefined,
  saveScreenShot: vi.fn(),
}));
