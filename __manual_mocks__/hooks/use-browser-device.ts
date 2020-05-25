export const setBrowserDeviceMock = jest.fn();
jest.mock('../../src/hooks/use-browser-device', () => ({
  useBrowserDevice: () => ({
    browserDevice: {},
    setBrowserDevice: setBrowserDeviceMock,
  }),
}));
