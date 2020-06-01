import { useCallback, useState, useEffect } from 'react';
import { BrowserTypes, ScreenShotViewPanel } from '../typings';
import { useAddonState } from './use-addon-state';

export const useActiveBrowsers = (browserView: ScreenShotViewPanel) => {
  const { addonState, setAddonState } = useAddonState();
  const [activeBrowsers, setActiveBrowsers] = useState<BrowserTypes[]>([]);
  const [browserTypes] = useState<BrowserTypes[]>([
    'chromium',
    'firefox',
    'webkit',
  ]);

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
    (
      browserType: BrowserTypes,
      activePanel: ScreenShotViewPanel,
      disable: boolean,
    ) => {
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
      setBrowserState(browserType, browserView, !isDisabled(browserType));
    },
    [browserView, isDisabled, setBrowserState],
  );

  useEffect(() => {
    if (!addonState || !Object.keys(addonState).length) return;
    const activeBrs = browserTypes.filter((b) => !isDisabled(b));
    setActiveBrowsers(activeBrs);
  }, [addonState, browserTypes, isDisabled]);

  return {
    activeBrowsers,
    browserTypes,
    isDisabled,
    setBrowserState,
    toggleBrowser,
  };
};
