import { useActiveBrowsers } from '../use-active-browser';
import { renderHook, act } from '@testing-library/react-hooks';
import { BrowserTypes } from '../../typings';
describe('useActiveBrowsers', () => {
  it('should not be disabled', () => {
    const { result } = renderHook(() =>
      useActiveBrowsers(['chromium', 'firefox', 'webkit'], 'main'),
    );

    expect(result.current.isDisabled('chromium')).toBe(false);
  });

  it('should be disable', () => {
    const browserTypes: BrowserTypes[] = ['chromium', 'firefox', 'webkit'];
    const { result } = renderHook(() =>
      useActiveBrowsers(browserTypes, 'dialog'),
    );

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.isDisabled('chromium')).toBe(true);

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.isDisabled('chromium')).toBe(false);
  });
});
