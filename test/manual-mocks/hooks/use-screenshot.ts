export const useScreenshotMock = vi.fn<(...args: unknown[]) => unknown>();
export const getSnapshotMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock('../../../src/features/screenshot/hooks/use-screenshot', () => ({
  useScreenshot: useScreenshotMock,
}));

useScreenshotMock.mockImplementation(() => {
  return {
    getSnapshot: getSnapshotMock,
    loading: false,
    screenshot: {
      base64: 'base64-image',
      error: undefined,
    },
  };
});
