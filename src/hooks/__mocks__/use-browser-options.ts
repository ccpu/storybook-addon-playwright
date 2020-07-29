export const useBrowserOptions = jest.fn().mockImplementation(() => ({
  browserOptions: { all: {} },
  getBrowserOptions: jest.fn(),
  setBrowserDeviceOptions: jest.fn(),
  setBrowserOptions: jest.fn(),
}));
