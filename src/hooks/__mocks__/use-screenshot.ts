export const useScreenshot = vi.fn().mockImplementation(() => ({
  getSnapshot: vi.fn(),
  loading: false,
  screenshot: undefined,
}));
