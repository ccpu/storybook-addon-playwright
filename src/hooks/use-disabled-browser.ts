import { useCallback } from 'react';
import { BrowserTypes, BrowserView } from '../typings';
import { useAddonState } from './use-addon-state';

export const useDisabledBrowserTypes = (browserView: BrowserView) => {
  const { addonState, setAddonState } = useAddonState();

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

  return { isDisabled, toggleBrowser };
};
