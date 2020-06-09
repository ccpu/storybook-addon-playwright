export const useScreenshot = jest.fn().mockImplementation(() => ({
  getSnapshot: jest.fn(),
  loading: false,
  screenshot: undefined,
}));
