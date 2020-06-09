export const useBrowserDevice = jest.fn().mockImplementation(() => ({
  browserDevice: {},
  setBrowserDevice: jest.fn(),
}));
