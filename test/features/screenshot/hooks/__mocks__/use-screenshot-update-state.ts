import { useScreenshotUpdateState as orgHook } from '../../../../../src/hooks';

export const useScreenshotUpdateState = vi.fn<typeof orgHook>();

vi.mocked(useScreenshotUpdateState).mockImplementation(() => ({
  handleClose: vi.fn(),
  handleLoadingDone: vi.fn(),
  runDiffTest: vi.fn(),
  updateInf: {},
}));
