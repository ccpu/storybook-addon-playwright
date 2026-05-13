export const useBrowserStateManager = vi.fn<(...args: unknown[]) => unknown>();
export const isDisabledMock = vi.fn<(...args: unknown[]) => unknown>();
export const toggleBrowserMock = vi.fn<(...args: unknown[]) => unknown>();

vi.mock('../../../src/hooks/use-browser-state-manager', () => ({
  useBrowserStateManager: useBrowserStateManager,
}));

useBrowserStateManager.mockImplementation(() => ({
  activeBrowsers: ['chromium', 'firefox', 'webkit'],
  clearBrowserRefresh: vi.fn(),
  isDisabled: isDisabledMock,
  refreshBrowsers: vi.fn(),
  refreshingBrowsers: [],
  toggleBrowser: toggleBrowserMock,
}));
