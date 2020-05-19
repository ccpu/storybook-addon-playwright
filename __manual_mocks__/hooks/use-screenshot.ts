export const useScreenshotMock = jest.fn();
export const getSnapshotMock = jest.fn();

jest.mock('../../src/hooks/use-screenshot', () => ({
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
