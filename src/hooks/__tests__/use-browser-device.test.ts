import { useBrowserDevice } from '../use-browser-device';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useBrowserDevice', () => {
  it('should have empty object', () => {
    const { result } = renderHook(() => useBrowserDevice());
    expect(result.current.browserDevice).toStrictEqual({});
  });

  it('should set device', () => {
    const { result } = renderHook(() => useBrowserDevice());
    act(() => {
      result.current.setBrowserDevice('chromium', 'iPhone 6');
    });
    expect(result.current.browserDevice).toStrictEqual({
      chromium: {
        deviceScaleFactor: 2,
        hasTouch: true,
        isMobile: true,
        name: 'iPhone 6',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: { height: 667, width: 375 },
      },
    });
  });
});
