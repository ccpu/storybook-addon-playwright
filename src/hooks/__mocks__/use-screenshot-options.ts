export const useScreenshotOptions = vi.fn();

useScreenshotOptions.mockImplementation(() => ({
  screenshotOptions: undefined,
  setScreenshotOptions: () => undefined,
}));
