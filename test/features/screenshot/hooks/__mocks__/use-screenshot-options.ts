import { useScreenshotOptions as orgHook } from '../../../../../src/hooks';

export const useScreenshotOptions = vi.fn<typeof orgHook>();

useScreenshotOptions.mockImplementation(() => ({
  screenshotOptions: undefined,
  setScreenshotOptions: () => undefined,
}));
