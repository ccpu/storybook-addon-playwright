import type { BrowserTypes, ScreenShotViewPanel } from '../typings';
import { useCallback, useMemo, useState } from 'react';
import { useAddonState } from './use-addon-state';

export function useActiveBrowsers(browserView: ScreenShotViewPanel) {
  const { addonState, setAddonState } = useAddonState();
  const [refreshingBrowsers, setRefreshBrowsers] = useState<BrowserTypes[]>([]);
  const [browserTypes] = useState<BrowserTypes[]>(['chromium', 'firefox', 'webkit']);

  const isDisabled = useCallback(
    (browserType: BrowserTypes) => {
      if (
        !addonState ||
        !addonState.disabledBrowser ||
        !addonState.disabledBrowser[browserView] ||
        !addonState.disabledBrowser[browserView][browserType]
      ) {
        return false;
      }
      return true;
    },
    [addonState, browserView],
  );

  const setBrowserState = useCallback(
    (browserType: BrowserTypes, activePanel: ScreenShotViewPanel, disable: boolean) => {
      if (!addonState.disabledBrowser) addonState.disabledBrowser = {};
      setAddonState({
        ...addonState,
        disabledBrowser: {
          ...addonState.disabledBrowser,
          [activePanel]: {
            ...addonState.disabledBrowser[activePanel],
            [browserType]: disable,
          },
        },
      });
    },
    [addonState, setAddonState],
  );

  const toggleBrowser = useCallback(
    (browserType: BrowserTypes) => {
      const disable = !isDisabled(browserType);

      setBrowserState(browserType, browserView, disable);

      if (disable) {
        setRefreshBrowsers((current) =>
          current.filter((browser) => browser !== browserType),
        );
        return;
      }

      setRefreshBrowsers((current) =>
        current.includes(browserType) ? current : [...current, browserType],
      );
    },
    [browserView, isDisabled, setBrowserState],
  );

  const clearBrowserRefresh = useCallback((browserType: BrowserTypes) => {
    setRefreshBrowsers((current) => current.filter((browser) => browser !== browserType));
  }, []);

  const activeBrowsers = useMemo(
    () => browserTypes.filter((browserType) => !isDisabled(browserType)),
    [browserTypes, isDisabled],
  );

  return {
    activeBrowsers,
    browserTypes,
    isDisabled,
    refreshingBrowsers,
    clearBrowserRefresh,
    setBrowserState,
    toggleBrowser,
    refreshBrowsers: setRefreshBrowsers,
  };
}
