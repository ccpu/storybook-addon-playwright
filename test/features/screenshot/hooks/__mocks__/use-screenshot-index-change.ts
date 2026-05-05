import { useScreenshotIndexChange as orgHook } from '../../../../../src/hooks';

const useScreenshotIndexChange = vi.fn<typeof orgHook>();

useScreenshotIndexChange.mockImplementation(() => ({
  ChangeIndexInProgress: false,
  ChangeIndexSuccessSnackbar: () => undefined,
  changeIndex: vi.fn(),
}));

export { useScreenshotIndexChange };
