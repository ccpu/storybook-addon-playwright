export const useScreenshotMock = vi.fn();
export const getSnapshotMock = vi.fn();

vi.mock('../../src/hooks/use-screenshot', () => ({
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
