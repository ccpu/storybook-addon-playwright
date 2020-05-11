import { useCallback, useState, useEffect } from 'react';
import { BrowserTypes, ScreenShotViewPanel } from '../typings';
import { useAddonState } from './use-addon-state';

export const useActiveBrowsers = (
  browserTypes: BrowserTypes[],
  browserView: ScreenShotViewPanel,
) => {
  const { addonState, setAddonState } = useAddonState();
  const [activeBrowsers, setActiveBrowsers] = useState<BrowserTypes[]>();

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

  const toggleBrowser = useCallback(
    (browserType: BrowserTypes) => {
      if (isDisabled(browserType)) {
        delete addonState.disabledBrowser[browserView][browserType];
      } else {
        if (!addonState.disabledBrowser) {
          addonState.disabledBrowser = {};
        }
        if (!addonState.disabledBrowser[browserView]) {
          addonState.disabledBrowser[browserView] = {};
        }
        addonState.disabledBrowser[browserView][browserType] = true;
      }
      setAddonState({
        ...addonState,
        disabledBrowser: {
          ...addonState.disabledBrowser,
          [browserType]: {
            ...addonState.disabledBrowser[browserType],
          },
        },
      });
    },
    [addonState, browserView, isDisabled, setAddonState],
  );

  useEffect(() => {
    if (!addonState || !Object.keys(addonState).length) return;
    const activeBrs = browserTypes.filter((b) => !isDisabled(b));
    setActiveBrowsers(activeBrs);
  }, [addonState, browserTypes, isDisabled]);

  return { activeBrowsers, isDisabled, toggleBrowser };
};
