import type { BrowsersOptionTypes } from '../store';
import type { BrowserContextOptions, BrowserTypes } from '../typings';
import { useCallback, useMemo } from 'react';
import {
  setBrowserOptions as setStoreBrowserOptions,
  useBrowserOptionsValue,
} from '../store';
import { getDeviceInfo } from '../utils';

export type { BrowsersOption, BrowsersOptionTypes } from '../store';

export function useBrowserOptions(browserName?: BrowsersOptionTypes) {
  const browserOptions = useBrowserOptionsValue();

  const setBrowserDeviceOptions = useCallback(
    (browserType: BrowsersOptionTypes, deviceName: string) => {
      setStoreBrowserOptions({
        ...browserOptions,
        [browserType]: getDeviceInfo(deviceName),
      });
    },
    [browserOptions],
  );

  const setBrowserOptions = useCallback(
    (browserType: BrowsersOptionTypes, options: BrowserContextOptions) => {
      setStoreBrowserOptions({
        ...browserOptions,
        [browserType]: options,
      });
    },
    [browserOptions],
  );

  const getBrowserOptions = useCallback(
    (browserType: BrowserTypes) => ({
      ...browserOptions.all,
      ...browserOptions[browserType],
    }),
    [browserOptions],
  );

  const hasOption = useMemo(() => {
    if (!browserName) return false;

    const hasOpt =
      browserOptions &&
      browserOptions[browserName] &&
      Object.keys(browserOptions[browserName]).length > 0;
    return hasOpt;
  }, [browserOptions, browserName]);

  return {
    browserOptions,
    getBrowserOptions,
    hasOption,
    setBrowserDeviceOptions,
    setBrowserOptions,
  };
}
