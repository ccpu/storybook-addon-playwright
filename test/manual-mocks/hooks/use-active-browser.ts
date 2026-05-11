export const useActiveBrowserMock = vi.fn<(...args: unknown[]) => unknown>();
export const isDisabledMock = vi.fn<(...args: unknown[]) => unknown>();
export const toggleBrowserMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock('../../../src/hooks/use-active-browser', () => ({
  useActiveBrowsers: useActiveBrowserMock,
}));

useActiveBrowserMock.mockImplementation(() => ({
  activeBrowsers: ['chromium', 'firefox', 'webkit'],
  clearBrowserRefresh: vi.fn(),
  isDisabled: isDisabledMock,
  refreshBrowsers: vi.fn(),
  refreshingBrowsers: [],
  toggleBrowser: toggleBrowserMock,
}));
