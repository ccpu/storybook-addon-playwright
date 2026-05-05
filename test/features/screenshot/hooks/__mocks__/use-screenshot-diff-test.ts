import { useScreenshotDiffTest as orgHook } from '../../../../../src/hooks';

const useScreenshotDiffTest = vi.fn<typeof orgHook>();

useScreenshotDiffTest.mockImplementation(() => ({
  inProgress: false,
  reset: () => undefined,
  result: undefined,
  testScreenshot: async () => undefined,
  testScreenshotError: undefined,
}));

export { useScreenshotDiffTest };
