export const useActiveBrowserMock = jest.fn();
export const isDisabledMock = jest.fn();
export const toggleBrowserMock = jest.fn();

jest.mock('../../src/hooks/use-active-browser', () => ({
  useActiveBrowsers: useActiveBrowserMock,
}));

useActiveBrowserMock.mockImplementation(() => ({
  activeBrowsers: ['chromium', 'firefox', 'webkit'],
  isDisabled: isDisabledMock,
  toggleBrowser: toggleBrowserMock,
}));
