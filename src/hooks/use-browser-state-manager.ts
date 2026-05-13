import type { BrowserTypes, ScreenShotViewPanel } from '../typings';
import { STORY_RENDERED } from '@storybook/core-events';
import { addons } from '@storybook/manager-api';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAddonState } from './use-addon-state';
import { useUIStore } from '../store';
import { deepEqual } from '@pixpilot/object';

const defaultBrowserTypes: BrowserTypes[] = ['chromium', 'firefox', 'webkit'];

export function useBrowserStateManager(browserView: ScreenShotViewPanel) {
  const { addonState, setAddonState } = useAddonState();
  const [refreshingBrowsers, setRefreshBrowsers] = useState<BrowserTypes[]>([]);
  const [browserTypes] = useState<BrowserTypes[]>(defaultBrowserTypes);

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

  useEffect(() => {
    const unsubscribe = useUIStore.subscribe((state, prevState) => {
      if (
        !deepEqual(state.browserOptions.all, prevState.browserOptions.all) ||
        !deepEqual(state.screenshotOptions, prevState.screenshotOptions)
      ) {
        setRefreshBrowsers(defaultBrowserTypes);
      }
      defaultBrowserTypes.forEach((browserType) => {
        if (
          !deepEqual(
            state.browserOptions[browserType],
            prevState.browserOptions[browserType],
          )
        ) {
          setRefreshBrowsers((current) =>
            current.includes(browserType) ? current : [...current, browserType],
          );
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, [browserTypes]);

  useEffect(() => {
    const channel = addons.getChannel();

    const onStoryRendered = () => {
      const activeBrowserTypes = defaultBrowserTypes.filter(
        (browserType) => !isDisabled(browserType),
      );

      setRefreshBrowsers((current) => {
        if (
          current.length === activeBrowserTypes.length &&
          activeBrowserTypes.every((browserType) => current.includes(browserType))
        ) {
          return current;
        }

        return activeBrowserTypes;
      });
    };

    channel.on(STORY_RENDERED, onStoryRendered);

    return () => {
      channel.off(STORY_RENDERED, onStoryRendered);
    };
  }, [isDisabled]);

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
