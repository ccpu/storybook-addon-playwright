import { useBrowserOptions } from '../use-browser-options';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useBrowserDevice', () => {
  it('should have empty object', () => {
    const { result } = renderHook(() => useBrowserOptions());
    expect(result.current.browserOptions).toStrictEqual({ all: {} });
  });

  it('should set option', () => {
    const { result } = renderHook(() => useBrowserOptions());
    act(() => {
      result.current.setBrowserOptions('all', { cursor: true });
    });
    expect(result.current.browserOptions).toStrictEqual({
      all: { cursor: true },
    });
  });

  it('should merge options', () => {
    const { result } = renderHook(() => useBrowserOptions());

    act(() => {
      result.current.setBrowserOptions('all', { cursor: true });
    });

    act(() => {
      result.current.setBrowserOptions('chromium', {
        deviceName: 'iphone',
      });
    });

    expect(result.current.getBrowserOptions('chromium')).toStrictEqual({
      cursor: true,
      deviceName: 'iphone',
    });
  });

  it('should set device options', () => {
    const { result } = renderHook(() => useBrowserOptions());
    act(() => {
      result.current.setBrowserDeviceOptions('chromium', 'iPhone 6');
    });

    expect(result.current.browserOptions).toStrictEqual({
      all: { cursor: true },
      chromium: {
        deviceName: 'iPhone 6',
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: { height: 667, width: 375 },
      },
    });
  });

  it('should check if browser type has options', () => {
    const { result } = renderHook(() => useBrowserOptions('chromium'));
    act(() => {
      result.current.setBrowserDeviceOptions('chromium', 'iPhone 6');
    });

    expect(result.current.hasOption).toBe(true);
  });
});
