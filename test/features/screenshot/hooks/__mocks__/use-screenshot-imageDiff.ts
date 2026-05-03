const useScreenshotImageDiff = vi.fn();

useScreenshotImageDiff.mockImplementation(() => ({
  inProgress: false,
  testScreenshot: () => undefined,
  testScreenshotError: undefined,
}));

export { useScreenshotImageDiff };
