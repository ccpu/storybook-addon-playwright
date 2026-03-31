export const useBrowserOptions = vi.fn().mockImplementation(() => ({
  browserOptions: { all: {} },
  getBrowserOptions: vi.fn(),
  setBrowserDeviceOptions: vi.fn(),
  setBrowserOptions: vi.fn(),
}));
