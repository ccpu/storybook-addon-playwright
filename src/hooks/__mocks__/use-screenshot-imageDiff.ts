import { createElement } from 'react';
const useScreenshotImageDiff = jest.fn();

useScreenshotImageDiff.mockImplementation(() => ({
  TestScreenshotErrorSnackbar: () => createElement('div'),
  inProgress: false,
  testScreenshot: () => undefined,
  testScreenshotError: undefined,
}));

export { useScreenshotImageDiff };
