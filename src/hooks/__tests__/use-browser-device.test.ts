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
      result.current.setBrowserDevice('chromium', 'foo');
    });
    expect(result.current.browserDevice).toStrictEqual({
      chromium: { name: 'foo' },
    });
  });
});
