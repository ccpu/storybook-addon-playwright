export const useScreenshotUpdateState = vi.fn();

vi.mocked(useScreenshotUpdateState).mockImplementation(() => ({
  handleClose: vi.fn(),
  handleLoadingDone: vi.fn(),
  runDiffTest: vi.fn(),
  updateInf: {},
}));
