import { useActiveBrowsers } from '../../src/hooks/use-active-browser';
import { renderHook, act } from '@testing-library/react-hooks';

vi.mock('../../src/hooks/use-addon-state', async () => {
  const React = await import('react');

  return {
    useAddonState: () => {
      const [addonState, setAddonState] = React.useState({
        clippingWarningDismissed: false,
        previewPanelEnabled: true,
      });

      return {
        addonState,
        setAddonState,
      };
    },
  };
});

describe('useActiveBrowsers', () => {
  it('should not be disabled', () => {
    const { result } = renderHook(() => useActiveBrowsers('main'));

    expect(result.current.isDisabled('chromium')).toBe(false);
  });

  it('should mark enabled browsers for refresh', () => {
    const { result } = renderHook(() => useActiveBrowsers('dialog'));

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.refreshingBrowsers).not.toContain('chromium');

    act(() => {
      result.current.toggleBrowser('chromium');
    });

    expect(result.current.refreshingBrowsers).toContain('chromium');
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
