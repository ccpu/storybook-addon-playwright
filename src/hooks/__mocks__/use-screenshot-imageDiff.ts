import { createElement } from 'react';
const useScreenshotImageDiff = vi.fn();

useScreenshotImageDiff.mockImplementation(() => ({
  TestScreenshotErrorSnackbar: () => createElement('div'),
  inProgress: false,
  testScreenshot: () => undefined,
  testScreenshotError: undefined,
}));

export { useScreenshotImageDiff };
