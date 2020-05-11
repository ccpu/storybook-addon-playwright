import { useDisabledBrowserTypes } from '../use-disabled-browser';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useDisabledBrowserTypes', () => {
  it('should not be disabled', () => {
    const { result } = renderHook(() => useDisabledBrowserTypes('dialog'));

    expect(result.current.isDisabled('chromium')).toBe(false);
  });

  it('should be disable', () => {
    const { result } = renderHook(() => useDisabledBrowserTypes('dialog'));

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
