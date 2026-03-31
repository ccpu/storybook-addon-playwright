export const useActiveBrowserMock = vi.fn();
export const isDisabledMock = vi.fn();
export const toggleBrowserMock = vi.fn();

vi.mock('../../src/hooks/use-active-browser', () => ({
  useActiveBrowsers: useActiveBrowserMock,
}));

useActiveBrowserMock.mockImplementation(() => ({
  activeBrowsers: ['chromium', 'firefox', 'webkit'],
  isDisabled: isDisabledMock,
  toggleBrowser: toggleBrowserMock,
}));
