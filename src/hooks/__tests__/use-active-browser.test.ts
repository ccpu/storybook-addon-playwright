import { useActiveBrowsers } from '../use-active-browser';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useActiveBrowsers', () => {
  it('should not be disabled', () => {
    const { result } = renderHook(() => useActiveBrowsers('main'));

    expect(result.current.isDisabled('chromium')).toBe(false);
  });

  it('should be disable', () => {
    const { result } = renderHook(() => useActiveBrowsers('dialog'));

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
