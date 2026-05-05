import { useScreenshot as orgHook } from '../../../../../src/hooks';

export const useScreenshot = vi.fn<typeof orgHook>().mockImplementation(() => ({
  error: undefined,
  getSnapshot: vi.fn(),
  loading: false,
  screenshot: undefined,
}));
