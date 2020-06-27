export const useScreenshotOptions = jest.fn();

useScreenshotOptions.mockImplementation(() => ({
  screenshotOptions: undefined,
  setScreenshotOptions: () => undefined,
}));
